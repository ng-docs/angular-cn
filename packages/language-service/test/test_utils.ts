/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CompileNgModuleMetadata, NgAnalyzedModules} from '@angular/compiler';
import {setup} from '@angular/compiler-cli/test/test_support';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

import {Span} from '../src/types';

export type MockData = string | MockDirectory;

export type MockDirectory = {
  [name: string]: MockData | undefined;
};

const angularts = /@angular\/(\w|\/|-)+\.tsx?$/;
const rxjsts = /rxjs\/(\w|\/)+\.tsx?$/;
const rxjsmetadata = /rxjs\/(\w|\/)+\.metadata\.json?$/;
const tsxfile = /\.tsx$/;

/* The missing cache does two things. First it improves performance of the
   tests as it reduces the number of OS calls made during testing. Also it
   improves debugging experience as fewer exceptions are raised allow you
   to use stopping on all exceptions. */
const missingCache = new Map<string, boolean>();
const cacheUsed = new Set<string>();
const reportedMissing = new Set<string>();

/**
 * The cache is valid if all the returned entries are empty.
 */
export function validateCache(): {exists: string[], unused: string[], reported: string[]} {
  const exists: string[] = [];
  const unused: string[] = [];
  for (const fileName of iterableToArray(missingCache.keys())) {
    if (fs.existsSync(fileName)) {
      exists.push(fileName);
    }
    if (!cacheUsed.has(fileName)) {
      unused.push(fileName);
    }
  }
  return {exists, unused, reported: iterableToArray(reportedMissing.keys())};
}

missingCache.set('/node_modules/@angular/core.d.ts', true);
missingCache.set('/node_modules/@angular/animations.d.ts', true);
missingCache.set('/node_modules/@angular/platform-browser/animations.d.ts', true);
missingCache.set('/node_modules/@angular/common.d.ts', true);
missingCache.set('/node_modules/@angular/forms.d.ts', true);
missingCache.set('/node_modules/@angular/core/src/di/provider.metadata.json', true);
missingCache.set(
    '/node_modules/@angular/core/src/change_detection/pipe_transform.metadata.json', true);
missingCache.set('/node_modules/@angular/core/src/reflection/types.metadata.json', true);
missingCache.set(
    '/node_modules/@angular/core/src/reflection/platform_reflection_capabilities.metadata.json',
    true);
missingCache.set('/node_modules/@angular/forms/src/directives/form_interface.metadata.json', true);

export class MockTypescriptHost implements ts.LanguageServiceHost {
  private angularPath: string|undefined;
  // TODO(issue/24571): remove '!'.
  private nodeModulesPath !: string;
  private scriptVersion = new Map<string, number>();
  private overrides = new Map<string, string>();
  private projectVersion = 0;
  private options: ts.CompilerOptions;
  private overrideDirectory = new Set<string>();
  private existsCache = new Map<string, boolean>();
  private fileCache = new Map<string, string|undefined>();

  constructor(
      private scriptNames: string[], private data: MockData,
      private node_modules: string = 'node_modules', private myPath: typeof path = path) {
    const support = setup();
    this.nodeModulesPath = path.posix.join(support.basePath, 'node_modules');
    this.angularPath = path.posix.join(this.nodeModulesPath, '@angular');
    this.options = {
      target: ts.ScriptTarget.ES5,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      removeComments: false,
      noImplicitAny: false,
      lib: ['lib.es2015.d.ts', 'lib.dom.d.ts'],
    };
  }

  override(fileName: string, content: string) {
    this.scriptVersion.set(fileName, (this.scriptVersion.get(fileName) || 0) + 1);
    if (fileName.endsWith('.ts')) {
      this.projectVersion++;
    }
    if (content) {
      this.overrides.set(fileName, content);
      this.overrideDirectory.add(path.dirname(fileName));
    } else {
      this.overrides.delete(fileName);
    }
    return content;
  }

  addScript(fileName: string, content: string) {
    this.projectVersion++;
    this.overrides.set(fileName, content);
    this.overrideDirectory.add(path.dirname(fileName));
    this.scriptNames.push(fileName);
  }

  forgetAngular() { this.angularPath = undefined; }

  overrideOptions(cb: (options: ts.CompilerOptions) => ts.CompilerOptions) {
    this.options = cb((Object as any).assign({}, this.options));
    this.projectVersion++;
  }

  getCompilationSettings(): ts.CompilerOptions { return this.options; }

  getProjectVersion(): string { return this.projectVersion.toString(); }

  getScriptFileNames(): string[] { return this.scriptNames; }

  getScriptVersion(fileName: string): string {
    return (this.scriptVersion.get(fileName) || 0).toString();
  }

  getScriptSnapshot(fileName: string): ts.IScriptSnapshot|undefined {
    const content = this.getFileContent(fileName);
    if (content) return ts.ScriptSnapshot.fromString(content);
    return undefined;
  }

  getCurrentDirectory(): string { return '/'; }

  getDefaultLibFileName(options: ts.CompilerOptions): string { return 'lib.d.ts'; }

  directoryExists(directoryName: string): boolean {
    if (this.overrideDirectory.has(directoryName)) return true;
    let effectiveName = this.getEffectiveName(directoryName);
    if (effectiveName === directoryName) {
      return directoryExists(directoryName, this.data);
    } else if (effectiveName == '/' + this.node_modules) {
      return true;
    } else {
      return this.pathExists(effectiveName);
    }
  }

  fileExists(fileName: string): boolean { return this.getRawFileContent(fileName) != null; }

  readFile(path: string): string|undefined { return this.getRawFileContent(path); }

  getMarkerLocations(fileName: string): {[name: string]: number}|undefined {
    let content = this.getRawFileContent(fileName);
    if (content) {
      return getLocationMarkers(content);
    }
  }

  getReferenceMarkers(fileName: string): ReferenceResult|undefined {
    let content = this.getRawFileContent(fileName);
    if (content) {
      return getReferenceMarkers(content);
    }
  }

  getFileContent(fileName: string): string|undefined {
    const content = this.getRawFileContent(fileName);
    if (content) return removeReferenceMarkers(removeLocationMarkers(content));
  }

  private getRawFileContent(fileName: string): string|undefined {
    if (this.overrides.has(fileName)) {
      return this.overrides.get(fileName);
    }
    let basename = path.basename(fileName);
    if (/^lib.*\.d\.ts$/.test(basename)) {
      let libPath = ts.getDefaultLibFilePath(this.getCompilationSettings());
      return fs.readFileSync(this.myPath.join(path.dirname(libPath), basename), 'utf8');
    } else {
      if (missingCache.has(fileName)) {
        cacheUsed.add(fileName);
        return undefined;
      }

      const effectiveName = this.getEffectiveName(fileName);
      if (effectiveName === fileName) {
        return open(fileName, this.data);
      } else if (
          !fileName.match(angularts) && !fileName.match(rxjsts) && !fileName.match(rxjsmetadata) &&
          !fileName.match(tsxfile)) {
        if (this.fileCache.has(effectiveName)) {
          return this.fileCache.get(effectiveName);
        } else if (this.pathExists(effectiveName)) {
          const content = fs.readFileSync(effectiveName, 'utf8');
          this.fileCache.set(effectiveName, content);
          return content;
        } else {
          missingCache.set(fileName, true);
          reportedMissing.add(fileName);
          cacheUsed.add(fileName);
        }
      }
    }
  }

  private pathExists(path: string): boolean {
    if (this.existsCache.has(path)) {
      return this.existsCache.get(path) !;
    }

    const exists = fs.existsSync(path);
    this.existsCache.set(path, exists);
    return exists;
  }

  private getEffectiveName(name: string): string {
    const node_modules = this.node_modules;
    const at_angular = '/@angular';
    if (name.startsWith('/' + node_modules)) {
      if (this.nodeModulesPath && !name.startsWith('/' + node_modules + at_angular)) {
        const result =
            this.myPath.posix.join(this.nodeModulesPath, name.substr(node_modules.length + 1));
        if (!name.match(rxjsts) && this.pathExists(result)) {
          return result;
        }
      }
      if (this.angularPath && name.startsWith('/' + node_modules + at_angular)) {
        return this.myPath.posix.join(
            this.angularPath, name.substr(node_modules.length + at_angular.length + 1));
      }
    }
    return name;
  }


  /**
   * Append a snippet of code to `app.component.ts` and return the file name.
   * There must not be any name collision with existing code.
   * @param code Snippet of code
   */
  addCode(code: string) {
    const fileName = '/app/app.component.ts';
    const originalContent = this.getFileContent(fileName);
    const newContent = originalContent + code;
    this.override(fileName, newContent);
    return fileName;
  }

  /**
   * Returns the definition marker ᐱselectorᐱ for the specified 'selector'.
   * Asserts that marker exists.
   * @param fileName name of the file
   * @param selector name of the marker
   */
  getDefinitionMarkerFor(fileName: string, selector: string): ts.TextSpan {
    const markers = this.getReferenceMarkers(fileName);
    expect(markers).toBeDefined();
    expect(Object.keys(markers !.definitions)).toContain(selector);
    expect(markers !.definitions[selector].length).toBe(1);
    const marker = markers !.definitions[selector][0];
    expect(marker.start).toBeLessThanOrEqual(marker.end);
    return {
      start: marker.start,
      length: marker.end - marker.start,
    };
  }

  /**
   * Returns the reference marker «selector» for the specified 'selector'.
   * Asserts that marker exists.
   * @param fileName name of the file
   * @param selector name of the marker
   */
  getReferenceMarkerFor(fileName: string, selector: string): ts.TextSpan {
    const markers = this.getReferenceMarkers(fileName);
    expect(markers).toBeDefined();
    expect(Object.keys(markers !.references)).toContain(selector);
    expect(markers !.references[selector].length).toBe(1);
    const marker = markers !.references[selector][0];
    expect(marker.start).toBeLessThanOrEqual(marker.end);
    return {
      start: marker.start,
      length: marker.end - marker.start,
    };
  }

  /**
   * Returns the location marker ~{selector} for the specified 'selector'.
   * Asserts that marker exists.
   * @param fileName name of the file
   * @param selector name of the marker
   */
  getLocationMarkerFor(fileName: string, selector: string): ts.TextSpan {
    const markers = this.getMarkerLocations(fileName);
    expect(markers).toBeDefined();
    const start = markers ![`start-${selector}`];
    expect(start).toBeDefined();
    const end = markers ![`end-${selector}`];
    expect(end).toBeDefined();
    expect(start).toBeLessThanOrEqual(end);
    return {
      start: start,
      length: end - start,
    };
  }
}

function iterableToArray<T>(iterator: IterableIterator<T>) {
  const result: T[] = [];
  while (true) {
    const next = iterator.next();
    if (next.done) break;
    result.push(next.value);
  }
  return result;
}

function find(fileName: string, data: MockData): MockData|undefined {
  let names = fileName.split('/');
  if (names.length && !names[0].length) names.shift();
  let current = data;
  for (let name of names) {
    if (typeof current === 'string')
      return undefined;
    else
      current = (<MockDirectory>current)[name] !;
    if (!current) return undefined;
  }
  return current;
}

function open(fileName: string, data: MockData): string|undefined {
  let result = find(fileName, data);
  if (typeof result === 'string') {
    return result;
  }
  return undefined;
}

function directoryExists(dirname: string, data: MockData): boolean {
  let result = find(dirname, data);
  return !!result && typeof result !== 'string';
}

const locationMarker = /\~\{(\w+(-\w+)*)\}/g;

function removeLocationMarkers(value: string): string {
  return value.replace(locationMarker, '');
}

function getLocationMarkers(value: string): {[name: string]: number} {
  value = removeReferenceMarkers(value);
  let result: {[name: string]: number} = {};
  let adjustment = 0;
  value.replace(locationMarker, (match: string, name: string, _: any, index: number): string => {
    result[name] = index - adjustment;
    adjustment += match.length;
    return '';
  });
  return result;
}

const referenceMarker = /«(((\w|\-)+)|([^ᐱ]*ᐱ(\w+)ᐱ.[^»]*))»/g;

export type ReferenceMarkers = {
  [name: string]: Span[]
};
export interface ReferenceResult {
  text: string;
  definitions: ReferenceMarkers;
  references: ReferenceMarkers;
}

function getReferenceMarkers(value: string): ReferenceResult {
  const references: ReferenceMarkers = {};
  const definitions: ReferenceMarkers = {};
  value = removeLocationMarkers(value);

  let adjustment = 0;
  const text = value.replace(
      referenceMarker, (match: string, text: string, reference: string, _: string,
                        definition: string, definitionName: string, index: number): string => {
        const result = reference ? text : text.replace(/ᐱ/g, '');
        const span: Span = {start: index - adjustment, end: index - adjustment + result.length};
        const markers = reference ? references : definitions;
        const name = reference || definitionName;
        (markers[name] = (markers[name] || [])).push(span);
        adjustment += match.length - result.length;
        return result;
      });

  return {text, definitions, references};
}

function removeReferenceMarkers(value: string): string {
  return value.replace(referenceMarker, (match, text) => text.replace(/ᐱ/g, ''));
}

/**
 * Find the StaticSymbol that has the specified `directiveName` and return its
 * Angular metadata, if any.
 * @param ngModules analyzed modules
 * @param directiveName
 */
export function findDirectiveMetadataByName(
    ngModules: NgAnalyzedModules, directiveName: string): CompileNgModuleMetadata|undefined {
  for (const [key, value] of ngModules.ngModuleByPipeOrDirective) {
    if (key.name === directiveName) {
      return value;
    }
  }
}
