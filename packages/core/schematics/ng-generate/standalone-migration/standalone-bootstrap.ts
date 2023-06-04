/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


import {NgtscProgram} from '@angular/compiler-cli';
import {TemplateTypeChecker} from '@angular/compiler-cli/private/migrations';
import {dirname, join} from 'path';
import ts from 'typescript';

import {ChangeTracker, ImportRemapper} from '../../utils/change_tracker';
import {getAngularDecorators} from '../../utils/ng_decorators';
import {closestNode} from '../../utils/typescript/nodes';

import {ComponentImportsRemapper, convertNgModuleDeclarationToStandalone, extractDeclarationsFromModule, findTestObjectsToMigrate, migrateTestDeclarations} from './to-standalone';
import {closestOrSelf, findClassDeclaration, findLiteralProperty, getNodeLookup, getRelativeImportPath, isClassReferenceInAngularModule, NamedClassDeclaration, NodeLookup, offsetsToNodes, ReferenceResolver, UniqueItemTracker} from './util';

/**
 * Information extracted from a `bootstrapModule` call necessary to migrate it.
 *
 * 从迁移它所必需的 `bootstrapModule` 调用中提取的信息。
 *
 */
interface BootstrapCallAnalysis {
  /**
   * The call itself.
   *
   * 调用本身。
   *
   */
  call: ts.CallExpression;
  /**
   * Class that is being bootstrapped.
   *
   * 正在引导的类。
   *
   */
  module: ts.ClassDeclaration;
  /**
   * Metadata of the module class being bootstrapped.
   *
   * 正在引导的模块类的元数据。
   *
   */
  metadata: ts.ObjectLiteralExpression;
  /**
   * Component that the module is bootstrapping.
   *
   * 模块正在引导的组件。
   *
   */
  component: NamedClassDeclaration;
  /**
   * Classes declared by the bootstrapped module.
   *
   * 由引导模块声明的类。
   *
   */
  declarations: ts.ClassDeclaration[];
}

export function toStandaloneBootstrap(
    program: NgtscProgram, host: ts.CompilerHost, basePath: string, rootFileNames: string[],
    sourceFiles: ts.SourceFile[], printer: ts.Printer, importRemapper?: ImportRemapper,
    referenceLookupExcludedFiles?: RegExp, componentImportRemapper?: ComponentImportsRemapper) {
  const tracker = new ChangeTracker(printer, importRemapper);
  const typeChecker = program.getTsProgram().getTypeChecker();
  const templateTypeChecker = program.compiler.getTemplateTypeChecker();
  const referenceResolver =
      new ReferenceResolver(program, host, rootFileNames, basePath, referenceLookupExcludedFiles);
  const bootstrapCalls: BootstrapCallAnalysis[] = [];
  const testObjects = new Set<ts.ObjectLiteralExpression>();
  const allDeclarations = new Set<ts.ClassDeclaration>();

  // `bootstrapApplication` doesn't include Protractor support by default
  // anymore so we have to opt the app in, if we detect it being used.
  const additionalProviders = hasImport(program, rootFileNames, 'protractor') ?
      new Map([['provideProtractorTestingSupport', '@angular/platform-browser']]) :
      null;

  for (const sourceFile of sourceFiles) {
    sourceFile.forEachChild(function walk(node) {
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) &&
          node.expression.name.text === 'bootstrapModule' &&
          isClassReferenceInAngularModule(node.expression, 'PlatformRef', 'core', typeChecker)) {
        const call = analyzeBootstrapCall(node, typeChecker, templateTypeChecker);

        if (call) {
          bootstrapCalls.push(call);
        }
      }
      node.forEachChild(walk);
    });

    findTestObjectsToMigrate(sourceFile, typeChecker).forEach(obj => testObjects.add(obj));
  }

  for (const call of bootstrapCalls) {
    call.declarations.forEach(decl => allDeclarations.add(decl));
    migrateBootstrapCall(
        call, tracker, additionalProviders, referenceResolver, typeChecker, printer);
  }

  // The previous migrations explicitly skip over bootstrapped
  // declarations so we have to migrate them now.
  for (const declaration of allDeclarations) {
    convertNgModuleDeclarationToStandalone(
        declaration, allDeclarations, tracker, templateTypeChecker, componentImportRemapper);
  }

  migrateTestDeclarations(testObjects, allDeclarations, tracker, templateTypeChecker, typeChecker);
  return tracker.recordChanges();
}

/**
 * Extracts all of the information from a `bootstrapModule` call
 * necessary to convert it to `bootstrapApplication`.
 *
 * 从 `bootstrapModule` 调用中提取将其转换为 `bootstrapApplication` 所需的所有信息。
 *
 * @param call Call to be analyzed.
 *
 * 调用进行分析。
 *
 * @param typeChecker
 * @param templateTypeChecker
 */
function analyzeBootstrapCall(
    call: ts.CallExpression, typeChecker: ts.TypeChecker,
    templateTypeChecker: TemplateTypeChecker): BootstrapCallAnalysis|null {
  if (call.arguments.length === 0 || !ts.isIdentifier(call.arguments[0])) {
    return null;
  }

  const declaration = findClassDeclaration(call.arguments[0], typeChecker);

  if (!declaration) {
    return null;
  }

  const decorator = getAngularDecorators(typeChecker, ts.getDecorators(declaration) || [])
                        .find(decorator => decorator.name === 'NgModule');

  if (!decorator || decorator.node.expression.arguments.length === 0 ||
      !ts.isObjectLiteralExpression(decorator.node.expression.arguments[0])) {
    return null;
  }

  const metadata = decorator.node.expression.arguments[0];
  const bootstrapProp = findLiteralProperty(metadata, 'bootstrap');

  if (!bootstrapProp || !ts.isPropertyAssignment(bootstrapProp) ||
      !ts.isArrayLiteralExpression(bootstrapProp.initializer) ||
      bootstrapProp.initializer.elements.length === 0 ||
      !ts.isIdentifier(bootstrapProp.initializer.elements[0])) {
    return null;
  }

  const component = findClassDeclaration(bootstrapProp.initializer.elements[0], typeChecker);

  if (component && component.name && ts.isIdentifier(component.name)) {
    return {
      module: declaration,
      metadata,
      component: component as NamedClassDeclaration,
      call,
      declarations: extractDeclarationsFromModule(declaration, templateTypeChecker)
    };
  }

  return null;
}

/**
 * Converts a `bootstrapModule` call to `bootstrapApplication`.
 *
 * 将 `bootstrapModule` 调用转换为 `bootstrapApplication`。
 *
 * @param analysis Analysis result of the call.
 *
 * 通话分析结果。
 *
 * @param tracker Tracker in which to register the changes.
 *
 * 在其中注册更改的跟踪器。
 *
 * @param additionalFeatures Additional providers, apart from the auto-detected ones, that should
 * be added to the bootstrap call.
 *
 * 除自动检测的提供程序外，应将其他提供程序添加到引导程序调用中。
 *
 * @param referenceResolver
 * @param typeChecker
 * @param printer
 */
function migrateBootstrapCall(
    analysis: BootstrapCallAnalysis, tracker: ChangeTracker,
    additionalProviders: Map<string, string>|null, referenceResolver: ReferenceResolver,
    typeChecker: ts.TypeChecker, printer: ts.Printer) {
  const sourceFile = analysis.call.getSourceFile();
  const moduleSourceFile = analysis.metadata.getSourceFile();
  const providers = findLiteralProperty(analysis.metadata, 'providers');
  const imports = findLiteralProperty(analysis.metadata, 'imports');
  const nodesToCopy = new Set<ts.Node>();
  const providersInNewCall: ts.Expression[] = [];
  const moduleImportsInNewCall: ts.Expression[] = [];
  let nodeLookup: NodeLookup|null = null;

  // Comment out the metadata so that it'll be removed when we run the module pruning afterwards.
  // If the pruning is left for some reason, the user will still have an actionable TODO.
  tracker.insertText(
      moduleSourceFile, analysis.metadata.getStart(),
      '/* TODO(standalone-migration): clean up removed NgModule class manually. \n');
  tracker.insertText(moduleSourceFile, analysis.metadata.getEnd(), ' */');

  if (providers && ts.isPropertyAssignment(providers)) {
    nodeLookup = nodeLookup || getNodeLookup(moduleSourceFile);

    if (ts.isArrayLiteralExpression(providers.initializer)) {
      providersInNewCall.push(...providers.initializer.elements);
    } else {
      providersInNewCall.push(ts.factory.createSpreadElement(providers.initializer));
    }

    addNodesToCopy(sourceFile, providers, nodeLookup, tracker, nodesToCopy, referenceResolver);
  }

  if (imports && ts.isPropertyAssignment(imports)) {
    nodeLookup = nodeLookup || getNodeLookup(moduleSourceFile);
    migrateImportsForBootstrapCall(
        sourceFile, imports, nodeLookup, moduleImportsInNewCall, providersInNewCall, tracker,
        nodesToCopy, referenceResolver, typeChecker);
  }

  if (additionalProviders) {
    additionalProviders.forEach((moduleSpecifier, name) => {
      providersInNewCall.push(ts.factory.createCallExpression(
          tracker.addImport(sourceFile, name, moduleSpecifier), undefined, undefined));
    });
  }

  if (nodesToCopy.size > 0) {
    let text = '\n\n';
    nodesToCopy.forEach(node => {
      const transformedNode = remapDynamicImports(sourceFile.fileName, node);

      // Use `getText` to try an preserve the original formatting. This only works if the node
      // hasn't been transformed. If it has, we have to fall back to the printer.
      if (transformedNode === node) {
        text += transformedNode.getText() + '\n';
      } else {
        text += printer.printNode(ts.EmitHint.Unspecified, transformedNode, node.getSourceFile());
      }
    });
    text += '\n';
    tracker.insertText(sourceFile, getLastImportEnd(sourceFile), text);
  }

  replaceBootstrapCallExpression(analysis, providersInNewCall, moduleImportsInNewCall, tracker);
}

/**
 * Replaces a `bootstrapModule` call with `bootstrapApplication`.
 *
 * 用 `bootstrapApplication` 替换 `bootstrapModule` 调用。
 *
 * @param analysis Analysis result of the `bootstrapModule` call.
 *
 * `bootstrapModule` 调用的分析结果。
 *
 * @param providers Providers that should be added to the new call.
 *
 * 应添加到新呼叫中的提供商。
 *
 * @param modules Modules that are being imported into the new call.
 *
 * 正在导入到新调用中的模块。
 *
 * @param tracker Object keeping track of the changes to the different files.
 *
 * 对象跟踪对不同文件的更改。
 *
 */
function replaceBootstrapCallExpression(
    analysis: BootstrapCallAnalysis, providers: ts.Expression[], modules: ts.Expression[],
    tracker: ChangeTracker): void {
  const sourceFile = analysis.call.getSourceFile();
  const componentPath =
      getRelativeImportPath(sourceFile.fileName, analysis.component.getSourceFile().fileName);
  const args = [tracker.addImport(sourceFile, analysis.component.name.text, componentPath)];
  const bootstrapExpression =
      tracker.addImport(sourceFile, 'bootstrapApplication', '@angular/platform-browser');

  if (providers.length > 0 || modules.length > 0) {
    const combinedProviders: ts.Expression[] = [];

    if (modules.length > 0) {
      const importProvidersExpression =
          tracker.addImport(sourceFile, 'importProvidersFrom', '@angular/core');
      combinedProviders.push(
          ts.factory.createCallExpression(importProvidersExpression, [], modules));
    }

    // Push the providers after `importProvidersFrom` call for better readability.
    combinedProviders.push(...providers);

    const providersArray = ts.factory.createNodeArray(
        combinedProviders,
        analysis.metadata.properties.hasTrailingComma && combinedProviders.length > 2);
    const initializer = remapDynamicImports(
        sourceFile.fileName,
        ts.factory.createArrayLiteralExpression(providersArray, combinedProviders.length > 1));

    args.push(ts.factory.createObjectLiteralExpression(
        [ts.factory.createPropertyAssignment('providers', initializer)], true));
  }

  tracker.replaceNode(
      analysis.call, ts.factory.createCallExpression(bootstrapExpression, [], args),
      // Note: it's important to pass in the source file that the nodes originated from!
      // Otherwise TS won't print out literals inside of the providers that we're copying
      // over from the module file.
      undefined, analysis.metadata.getSourceFile());
}

/**
 * Processes the `imports` of an NgModule so that they can be used in the `bootstrapApplication`
 * call inside of a different file.
 *
 * 处理 NgModule 的 `imports`，以便它们可以在不同文件内的 `bootstrapApplication` 调用中使用。
 *
 * @param sourceFile File to which the imports will be moved.
 *
 * 导入将移动到的文件。
 *
 * @param imports Node declaring the imports.
 *
 * 声明导入的节点。
 *
 * @param nodeLookup Map used to look up nodes based on their positions in a file.
 *
 * Map 用于根据节点在文件中的位置查找节点。
 *
 * @param importsForNewCall Array keeping track of the imports that are being added to the new call.
 *
 * 跟踪正在添加到新调用的导入的数组。
 *
 * @param providersInNewCall Array keeping track of the providers in the new call.
 *
 * 跟踪新调用中提供者的数组。
 *
 * @param tracker Tracker in which changes to files are being stored.
 *
 * 存储文件更改的跟踪器。
 *
 * @param nodesToCopy Nodes that should be copied to the new file.
 *
 * 应复制到新文件的节点。
 *
 * @param referenceResolver
 * @param typeChecker
 */
function migrateImportsForBootstrapCall(
    sourceFile: ts.SourceFile, imports: ts.PropertyAssignment, nodeLookup: NodeLookup,
    importsForNewCall: ts.Expression[], providersInNewCall: ts.Expression[], tracker: ChangeTracker,
    nodesToCopy: Set<ts.Node>, referenceResolver: ReferenceResolver,
    typeChecker: ts.TypeChecker): void {
  if (!ts.isArrayLiteralExpression(imports.initializer)) {
    importsForNewCall.push(imports.initializer);
    return;
  }

  for (const element of imports.initializer.elements) {
    // If the reference is to a `RouterModule.forRoot` call, we can try to migrate it.
    if (ts.isCallExpression(element) && ts.isPropertyAccessExpression(element.expression) &&
        element.arguments.length > 0 && element.expression.name.text === 'forRoot' &&
        isClassReferenceInAngularModule(
            element.expression.expression, 'RouterModule', 'router', typeChecker)) {
      const options = element.arguments[1] as ts.Expression | undefined;
      const features = options ? getRouterModuleForRootFeatures(sourceFile, options, tracker) : [];

      // If the features come back as null, it means that the router
      // has a configuration that can't be migrated automatically.
      if (features !== null) {
        providersInNewCall.push(ts.factory.createCallExpression(
            tracker.addImport(sourceFile, 'provideRouter', '@angular/router'), [],
            [element.arguments[0], ...features]));
        addNodesToCopy(
            sourceFile, element.arguments[0], nodeLookup, tracker, nodesToCopy, referenceResolver);
        if (options) {
          addNodesToCopy(sourceFile, options, nodeLookup, tracker, nodesToCopy, referenceResolver);
        }
        continue;
      }
    }

    if (ts.isIdentifier(element)) {
      // `BrowserAnimationsModule` can be replaced with `provideAnimations`.
      const animationsModule = 'platform-browser/animations';
      const animationsImport = `@angular/${animationsModule}`;

      if (isClassReferenceInAngularModule(
              element, 'BrowserAnimationsModule', animationsModule, typeChecker)) {
        providersInNewCall.push(ts.factory.createCallExpression(
            tracker.addImport(sourceFile, 'provideAnimations', animationsImport), [], []));
        continue;
      }

      // `NoopAnimationsModule` can be replaced with `provideNoopAnimations`.
      if (isClassReferenceInAngularModule(
              element, 'NoopAnimationsModule', animationsModule, typeChecker)) {
        providersInNewCall.push(ts.factory.createCallExpression(
            tracker.addImport(sourceFile, 'provideNoopAnimations', animationsImport), [], []));
        continue;
      }

      // `HttpClientModule` can be replaced with `provideHttpClient()`.
      const httpClientModule = 'common/http';
      const httpClientImport = `@angular/${httpClientModule}`;
      if (isClassReferenceInAngularModule(
              element, 'HttpClientModule', httpClientModule, typeChecker)) {
        const callArgs = [
          // we add `withInterceptorsFromDi()` to the call to ensure that class-based interceptors
          // still work
          ts.factory.createCallExpression(
              tracker.addImport(sourceFile, 'withInterceptorsFromDi', httpClientImport), [], [])
        ];
        providersInNewCall.push(ts.factory.createCallExpression(
            tracker.addImport(sourceFile, 'provideHttpClient', httpClientImport), [], callArgs));
        continue;
      }
    }

    const target =
        // If it's a call, it'll likely be a `ModuleWithProviders`
        // expression so the target is going to be call's expression.
        ts.isCallExpression(element) && ts.isPropertyAccessExpression(element.expression) ?
        element.expression.expression :
        element;
    const classDeclaration = findClassDeclaration(target, typeChecker);
    const decorators = classDeclaration ?
        getAngularDecorators(typeChecker, ts.getDecorators(classDeclaration) || []) :
        undefined;

    if (!decorators || decorators.length === 0 ||
        decorators.every(
            ({name}) => name !== 'Directive' && name !== 'Component' && name !== 'Pipe')) {
      importsForNewCall.push(element);
      addNodesToCopy(sourceFile, element, nodeLookup, tracker, nodesToCopy, referenceResolver);
    }
  }
}

/**
 * Generates the call expressions that can be used to replace the options
 * object that is passed into a `RouterModule.forRoot` call.
 *
 * 生成可用于替换传递到 `RouterModule.forRoot` 调用中的选项对象的调用表达式。
 *
 * @param sourceFile File that the `forRoot` call is coming from.
 *
 * `forRoot` 调用来自的文件。
 *
 * @param options Node that is passed as the second argument to the `forRoot` call.
 *
 * 作为第二个参数传递给 `forRoot` 调用的节点。
 *
 * @param tracker Tracker in which to track imports that need to be inserted.
 *
 * 跟踪需要插入的导入的跟踪器。
 *
 * @returns
 *
 * Null if the options can't be migrated, otherwise an array of call expressions.
 *
 * 如果无法迁移选项，则为 Null，否则为调用表达式数组。
 *
 */
function getRouterModuleForRootFeatures(
    sourceFile: ts.SourceFile, options: ts.Expression, tracker: ChangeTracker): ts.CallExpression[]|
    null {
  // Options that aren't a static object literal can't be migrated.
  if (!ts.isObjectLiteralExpression(options)) {
    return null;
  }

  const featureExpressions: ts.CallExpression[] = [];
  const configOptions: ts.PropertyAssignment[] = [];
  const inMemoryScrollingOptions: ts.PropertyAssignment[] = [];
  const features = new UniqueItemTracker<string, ts.Expression|null>();

  for (const prop of options.properties) {
    // We can't migrate options that we can't easily analyze.
    if (!ts.isPropertyAssignment(prop) ||
        (!ts.isIdentifier(prop.name) && !ts.isStringLiteralLike(prop.name))) {
      return null;
    }

    switch (prop.name.text) {
      // `preloadingStrategy` maps to the `withPreloading` function.
      case 'preloadingStrategy':
        features.track('withPreloading', prop.initializer);
        break;

      // `enableTracing: true` maps to the `withDebugTracing` feature.
      case 'enableTracing':
        if (prop.initializer.kind === ts.SyntaxKind.TrueKeyword) {
          features.track('withDebugTracing', null);
        }
        break;

      // `initialNavigation: 'enabled'` and `initialNavigation: 'enabledBlocking'` map to the
      // `withEnabledBlockingInitialNavigation` feature, while `initialNavigation: 'disabled'` maps
      // to the `withDisabledInitialNavigation` feature.
      case 'initialNavigation':
        if (!ts.isStringLiteralLike(prop.initializer)) {
          return null;
        }
        if (prop.initializer.text === 'enabledBlocking' || prop.initializer.text === 'enabled') {
          features.track('withEnabledBlockingInitialNavigation', null);
        } else if (prop.initializer.text === 'disabled') {
          features.track('withDisabledInitialNavigation', null);
        }
        break;

      // `useHash: true` maps to the `withHashLocation` feature.
      case 'useHash':
        if (prop.initializer.kind === ts.SyntaxKind.TrueKeyword) {
          features.track('withHashLocation', null);
        }
        break;

      // `errorHandler` maps to the `withNavigationErrorHandler` feature.
      case 'errorHandler':
        features.track('withNavigationErrorHandler', prop.initializer);
        break;

      // `anchorScrolling` and `scrollPositionRestoration` arguments have to be combined into an
      // object literal that is passed into the `withInMemoryScrolling` feature.
      case 'anchorScrolling':
      case 'scrollPositionRestoration':
        inMemoryScrollingOptions.push(prop);
        break;

      // All remaining properties can be passed through the `withRouterConfig` feature.
      default:
        configOptions.push(prop);
        break;
    }
  }

  if (inMemoryScrollingOptions.length > 0) {
    features.track(
        'withInMemoryScrolling',
        ts.factory.createObjectLiteralExpression(inMemoryScrollingOptions));
  }

  if (configOptions.length > 0) {
    features.track('withRouterConfig', ts.factory.createObjectLiteralExpression(configOptions));
  }

  for (const [feature, featureArgs] of features.getEntries()) {
    const callArgs: ts.Expression[] = [];
    featureArgs.forEach(arg => {
      if (arg !== null) {
        callArgs.push(arg);
      }
    });
    featureExpressions.push(ts.factory.createCallExpression(
        tracker.addImport(sourceFile, feature, '@angular/router'), [], callArgs));
  }

  return featureExpressions;
}

/**
 * Finds all the nodes that are referenced inside a root node and would need to be copied into a
 * new file in order for the node to compile, and tracks them.
 *
 * 查找在根节点内引用的所有节点，并且需要将其复制到新文件中以便节点进行编译，并跟踪它们。
 *
 * @param targetFile File to which the nodes will be copied.
 *
 * 节点将复制到的文件。
 *
 * @param rootNode Node within which to look for references.
 *
 * 在其中查找引用的节点。
 *
 * @param nodeLookup Map used to look up nodes based on their positions in a file.
 *
 * Map 用于根据节点在文件中的位置查找节点。
 *
 * @param tracker Tracker in which changes to files are stored.
 *
 * 存储文件更改的跟踪器。
 *
 * @param nodesToCopy Set that keeps track of the nodes being copied.
 *
 * 设置跟踪正在复制的节点。
 *
 * @param referenceResolver
 */
function addNodesToCopy(
    targetFile: ts.SourceFile, rootNode: ts.Node, nodeLookup: NodeLookup, tracker: ChangeTracker,
    nodesToCopy: Set<ts.Node>, referenceResolver: ReferenceResolver): void {
  const refs = findAllSameFileReferences(rootNode, nodeLookup, referenceResolver);

  for (const ref of refs) {
    const importSpecifier = closestOrSelf(ref, ts.isImportSpecifier);
    const importDeclaration =
        importSpecifier ? closestNode(importSpecifier, ts.isImportDeclaration) : null;

    // If the reference is in an import, we need to add an import to the main file.
    if (importDeclaration && importSpecifier &&
        ts.isStringLiteralLike(importDeclaration.moduleSpecifier)) {
      const moduleName = importDeclaration.moduleSpecifier.text.startsWith('.') ?
          remapRelativeImport(targetFile.fileName, importDeclaration.moduleSpecifier) :
          importDeclaration.moduleSpecifier.text;
      const symbolName = importSpecifier.propertyName ? importSpecifier.propertyName.text :
                                                        importSpecifier.name.text;
      const alias = importSpecifier.propertyName ? importSpecifier.name.text : null;
      tracker.addImport(targetFile, symbolName, moduleName, alias);
      continue;
    }

    const variableDeclaration = closestOrSelf(ref, ts.isVariableDeclaration);
    const variableStatement =
        variableDeclaration ? closestNode(variableDeclaration, ts.isVariableStatement) : null;

    // If the reference is a variable, we can attempt to import it or copy it over.
    if (variableDeclaration && variableStatement && ts.isIdentifier(variableDeclaration.name)) {
      if (isExported(variableStatement)) {
        tracker.addImport(
            targetFile, variableDeclaration.name.text,
            getRelativeImportPath(targetFile.fileName, ref.getSourceFile().fileName));
      } else {
        nodesToCopy.add(variableStatement);
      }
      continue;
    }

    // Otherwise check if the reference is inside of an exportable declaration, e.g. a function.
    // This code that is safe to copy over into the new file or import it, if it's exported.
    const closestExportable = closestOrSelf(ref, isExportableDeclaration);
    if (closestExportable) {
      if (isExported(closestExportable) && closestExportable.name) {
        tracker.addImport(
            targetFile, closestExportable.name.text,
            getRelativeImportPath(targetFile.fileName, ref.getSourceFile().fileName));
      } else {
        nodesToCopy.add(closestExportable);
      }
    }
  }
}

/**
 * Finds all the nodes referenced within the root node in the same file.
 *
 * 查找同一文件中根节点内引用的所有节点。
 *
 * @param rootNode Node from which to start looking for references.
 *
 * 从中开始查找引用的节点。
 *
 * @param nodeLookup Map used to look up nodes based on their positions in a file.
 *
 * Map 用于根据节点在文件中的位置查找节点。
 *
 * @param referenceResolver
 */
function findAllSameFileReferences(
    rootNode: ts.Node, nodeLookup: NodeLookup, referenceResolver: ReferenceResolver): Set<ts.Node> {
  const results = new Set<ts.Node>();
  const traversedTopLevelNodes = new Set<ts.Node>();
  const excludeStart = rootNode.getStart();
  const excludeEnd = rootNode.getEnd();

  (function walk(node) {
    if (!isReferenceIdentifier(node)) {
      node.forEachChild(walk);
      return;
    }

    const refs = referencesToNodeWithinSameFile(
        node, nodeLookup, excludeStart, excludeEnd, referenceResolver);

    if (refs === null) {
      return;
    }

    for (const ref of refs) {
      if (results.has(ref)) {
        continue;
      }

      results.add(ref);

      const closestTopLevel = closestNode(ref, isTopLevelStatement);
      // Avoid re-traversing the same top-level nodes since we know what the result will be.
      if (!closestTopLevel || traversedTopLevelNodes.has(closestTopLevel)) {
        continue;
      }

      // Keep searching, starting from the closest top-level node. We skip import declarations,
      // because we already know about them and they may put the search into an infinite loop.
      if (!ts.isImportDeclaration(closestTopLevel) &&
          isOutsideRange(
              excludeStart, excludeEnd, closestTopLevel.getStart(), closestTopLevel.getEnd())) {
        traversedTopLevelNodes.add(closestTopLevel);
        walk(closestTopLevel);
      }
    }
  })(rootNode);

  return results;
}

/**
 * Finds all the nodes referring to a specific node within the same file.
 *
 * 查找引用同一文件中特定节点的所有节点。
 *
 * @param node Node whose references we're lookip for.
 *
 * 我们正在查找其引用的节点。
 *
 * @param nodeLookup Map used to look up nodes based on their positions in a file.
 *
 * Map 用于根据节点在文件中的位置查找节点。
 *
 * @param excludeStart Start of a range that should be excluded from the results.
 *
 * 应从结果中排除的范围的开始。
 *
 * @param excludeEnd End of a range that should be excluded from the results.
 *
 * 应从结果中排除的范围的末尾。
 *
 * @param referenceResolver
 */
function referencesToNodeWithinSameFile(
    node: ts.Identifier, nodeLookup: NodeLookup, excludeStart: number, excludeEnd: number,
    referenceResolver: ReferenceResolver): Set<ts.Node>|null {
  const offsets =
      referenceResolver.findSameFileReferences(node, node.getSourceFile().fileName)
          .filter(([start, end]) => isOutsideRange(excludeStart, excludeEnd, start, end));

  if (offsets.length > 0) {
    const nodes = offsetsToNodes(nodeLookup, offsets, new Set());

    if (nodes.size > 0) {
      return nodes;
    }
  }

  return null;
}

/**
 * Transforms a node so that any dynamic imports with relative file paths it contains are remapped
 * as if they were specified in a different file. If no transformations have occurred, the original
 * node will be returned.
 *
 * 转换一个节点，以便它包含的任何具有相对文件路径的动态导入都被重新映射，就好像它们是在不同的文件中指定的一样。如果没有发生任何转换，将返回原始节点。
 *
 * @param targetFileName File name to which to remap the imports.
 *
 * 将导入重新映射到的文件名。
 *
 * @param rootNode Node being transformed.
 *
 * 正在转换的节点。
 *
 */
function remapDynamicImports<T extends ts.Node>(targetFileName: string, rootNode: T): T {
  let hasChanged = false;
  const transformer: ts.TransformerFactory<ts.Node> = context => {
    return sourceFile => ts.visitNode(sourceFile, function walk(node: ts.Node): ts.Node {
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword &&
          node.arguments.length > 0 && ts.isStringLiteralLike(node.arguments[0]) &&
          node.arguments[0].text.startsWith('.')) {
        hasChanged = true;
        return context.factory.updateCallExpression(node, node.expression, node.typeArguments, [
          context.factory.createStringLiteral(
              remapRelativeImport(targetFileName, node.arguments[0])),
          ...node.arguments.slice(1)
        ]);
      }
      return ts.visitEachChild(node, walk, context);
    });
  };

  const result = ts.transform(rootNode, [transformer]).transformed[0] as T;
  return hasChanged ? result : rootNode;
}

/**
 * Checks whether a node is a statement at the top level of a file.
 *
 * 检查节点是否是文件顶层的语句。
 *
 * @param node Node to be checked.
 *
 * 要检查的节点。
 *
 */
function isTopLevelStatement(node: ts.Node): node is ts.Node {
  return node.parent != null && ts.isSourceFile(node.parent);
}

/**
 * Asserts that a node is an identifier that might be referring to a symbol. This excludes
 * identifiers of named nodes like property assignments.
 *
 * 断言节点是可能引用符号的标识符。这不包括命名节点的标识符，如属性分配。
 *
 * @param node Node to be checked.
 *
 * 要检查的节点。
 *
 */
function isReferenceIdentifier(node: ts.Node): node is ts.Identifier {
  return ts.isIdentifier(node) &&
      (!ts.isPropertyAssignment(node.parent) && !ts.isParameter(node.parent) ||
       node.parent.name !== node);
}

/**
 * Checks whether a range is completely outside of another range.
 *
 * 检查一个范围是否完全在另一个范围之外。
 *
 * @param excludeStart Start of the exclusion range.
 *
 * 排除范围的开始。
 *
 * @param excludeEnd End of the exclusion range.
 *
 * 排除范围结束。
 *
 * @param start Start of the range that is being checked.
 *
 * 正在检查的范围的开始。
 *
 * @param end End of the range that is being checked.
 *
 * 正在检查的范围的末尾。
 *
 */
function isOutsideRange(
    excludeStart: number, excludeEnd: number, start: number, end: number): boolean {
  return (start < excludeStart && end < excludeStart) || start > excludeEnd;
}

/**
 * Remaps the specifier of a relative import from its original location to a new one.
 *
 * 将相对导入的说明符从其原始位置重新映射到新位置。
 *
 * @param targetFileName Name of the file that the specifier will be moved to.
 *
 * 说明符将移动到的文件的名称。
 *
 * @param specifier Specifier whose path is being remapped.
 *
 * 正在重新映射其路径的说明符。
 *
 */
function remapRelativeImport(targetFileName: string, specifier: ts.StringLiteralLike): string {
  return getRelativeImportPath(
      targetFileName, join(dirname(specifier.getSourceFile().fileName), specifier.text));
}

/**
 * Whether a node is exported.
 *
 * 节点是否导出。
 *
 * @param node Node to be checked.
 *
 * 要检查的节点。
 *
 */
function isExported(node: ts.Node): node is ts.Node {
  return ts.canHaveModifiers(node) && node.modifiers ?
      node.modifiers.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) :
      false;
}

/**
 * Asserts that a node is an exportable declaration, which means that it can either be exported or
 * it can be safely copied into another file.
 *
 * 断言节点是可导出声明，这意味着它可以导出或可以安全地复制到另一个文件中。
 *
 * @param node Node to be checked.
 *
 * 要检查的节点。
 *
 */
function isExportableDeclaration(node: ts.Node): node is ts.EnumDeclaration|ts.ClassDeclaration|
    ts.FunctionDeclaration|ts.InterfaceDeclaration|ts.TypeAliasDeclaration {
  return ts.isEnumDeclaration(node) || ts.isClassDeclaration(node) ||
      ts.isFunctionDeclaration(node) || ts.isInterfaceDeclaration(node) ||
      ts.isTypeAliasDeclaration(node);
}

/**
 * Gets the index after the last import in a file. Can be used to insert new code into the file.
 *
 * 获取文件中最后一次导入后的索引。可用于将新代码插入文件。
 *
 * @param sourceFile File in which to search for imports.
 *
 * 在其中搜索导入的文件。
 *
 */
function getLastImportEnd(sourceFile: ts.SourceFile): number {
  let index = 0;

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      index = Math.max(index, statement.getEnd());
    } else {
      break;
    }
  }

  return index;
}

/**
 * Checks if any of the program's files has an import of a specific module.
 *
 * 检查程序的任何文件是否导入了特定模块。
 *
 */
function hasImport(program: NgtscProgram, rootFileNames: string[], moduleName: string): boolean {
  const tsProgram = program.getTsProgram();
  const deepImportStart = moduleName + '/';

  for (const fileName of rootFileNames) {
    const sourceFile = tsProgram.getSourceFile(fileName);

    if (!sourceFile) {
      continue;
    }

    for (const statement of sourceFile.statements) {
      if (ts.isImportDeclaration(statement) && ts.isStringLiteralLike(statement.moduleSpecifier) &&
          (statement.moduleSpecifier.text === moduleName ||
           statement.moduleSpecifier.text.startsWith(deepImportStart))) {
        return true;
      }
    }
  }

  return false;
}
