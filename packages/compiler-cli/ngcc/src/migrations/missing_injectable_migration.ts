/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {forwardRefResolver} from '../../../src/ngtsc/annotations';
import {Reference} from '../../../src/ngtsc/imports';
import {ResolvedValue, ResolvedValueMap} from '../../../src/ngtsc/partial_evaluator';
import {ClassDeclaration, Decorator} from '../../../src/ngtsc/reflection';

import {Migration, MigrationHost} from './migration';
import {createInjectableDecorator, isClassDeclaration} from './utils';

/**
 * Ensures that classes that are provided as an Angular service in either `NgModule.providers` or
 * `Directive.providers`/`Component.viewProviders` are decorated with one of the `@Injectable`,
 * `@Directive`, `@Component` or `@Pipe` decorators, adding an `@Injectable()` decorator when none
 * are present.
 *
 * 确保在 `NgModule.providers` 或 `Directive.providers` / `Component.viewProviders` 中作为 Angular
 * 服务提供的类使用 `@Injectable` 、 `@Directive` 、 `@Component` 或 `@Pipe` 装饰器之一装饰，当添加
 * `@Injectable()` 装饰器时一个都不存在。
 *
 * At least one decorator is now mandatory, as otherwise the compiler would not compile an
 * injectable definition for the service. This is unlike View Engine, where having just an unrelated
 * decorator may have been sufficient for the service to become injectable.
 *
 * 现在至少有一个装饰器是强制性的，否则编译器将不会为服务编译可注入定义。这与 View Engine 不同，在
 * View Engine 中，只有一个不相关的装饰器可能就足以让服务变得可注入。
 *
 * In essence, this migration operates on classes that are themselves an NgModule, Directive or
 * Component. Their metadata is statically evaluated so that their "providers"/"viewProviders"
 * properties can be analyzed. For any provider that refers to an undecorated class, the class will
 * be migrated to have an `@Injectable()` decorator.
 *
 * 从本质上，这种迁移会在本身就是
 * NgModule、指令或组件的类上运行。它们的元数据是静态估算的，以便可以分析它们的“providers”/“viewProviders”属性。对于任何引用未装饰类的提供者，该类将被迁移以具有
 * `@Injectable()` 装饰器。
 *
 * This implementation mirrors the "missing-injectable" schematic.
 *
 * 此实现反映了“缺失的可注入”原理图。
 *
 */
export class MissingInjectableMigration implements Migration {
  apply(clazz: ClassDeclaration, host: MigrationHost): ts.Diagnostic|null {
    const decorators = host.reflectionHost.getDecoratorsOfDeclaration(clazz);
    if (decorators === null) {
      return null;
    }

    for (const decorator of decorators) {
      const name = getAngularCoreDecoratorName(decorator);
      if (name === 'NgModule') {
        migrateNgModuleProviders(decorator, host);
      } else if (name === 'Directive') {
        migrateDirectiveProviders(decorator, host, /* isComponent */ false);
      } else if (name === 'Component') {
        migrateDirectiveProviders(decorator, host, /* isComponent */ true);
      }
    }

    return null;
  }
}

/**
 * Iterates through all `NgModule.providers` and adds the `@Injectable()` decorator to any provider
 * that is not otherwise decorated.
 *
 * 迭代所有 `NgModule.providers` ，并将 `@Injectable()` 装饰器添加到任何未以其他方式装饰的提供者。
 *
 */
function migrateNgModuleProviders(decorator: Decorator, host: MigrationHost): void {
  if (decorator.args === null || decorator.args.length !== 1) {
    return;
  }

  const metadata = host.evaluator.evaluate(decorator.args[0], forwardRefResolver);
  if (!(metadata instanceof Map)) {
    return;
  }

  migrateProviders(metadata, 'providers', host);
  // TODO(alxhub): we should probably also check for `ModuleWithProviders` here.
}

/**
 * Iterates through all `Directive.providers` and if `isComponent` is set to true also
 * `Component.viewProviders` and adds the `@Injectable()` decorator to any provider that is not
 * otherwise decorated.
 *
 * 迭代所有 `Directive.providers` ，如果 `isComponent` 也设置为 `Component.viewProviders` ，并将
 * `@Injectable()` 装饰器添加到任何未以其他方式装饰的提供者。
 *
 */
function migrateDirectiveProviders(
    decorator: Decorator, host: MigrationHost, isComponent: boolean): void {
  if (decorator.args === null || decorator.args.length !== 1) {
    return;
  }

  const metadata = host.evaluator.evaluate(decorator.args[0], forwardRefResolver);
  if (!(metadata instanceof Map)) {
    return;
  }

  migrateProviders(metadata, 'providers', host);
  if (isComponent) {
    migrateProviders(metadata, 'viewProviders', host);
  }
}

/**
 * Given an object with decorator metadata, iterates through the list of providers to add
 * `@Injectable()` to any provider that is not otherwise decorated.
 *
 * 给定一个带有装饰器元数据的对象，迭代提供者列表以将 `@Injectable()`
 * 添加到任何未以其他方式装饰的提供者。
 *
 */
function migrateProviders(metadata: ResolvedValueMap, field: string, host: MigrationHost): void {
  if (!metadata.has(field)) {
    return;
  }
  const providers = metadata.get(field)!;
  if (!Array.isArray(providers)) {
    return;
  }

  for (const provider of providers) {
    migrateProvider(provider, host);
  }
}

/**
 * Analyzes a single provider entry and determines the class that is required to have an
 * `@Injectable()` decorator.
 *
 * 分析单个提供程序条目并确定需要具有 `@Injectable()` 装饰器的类。
 *
 */
function migrateProvider(provider: ResolvedValue, host: MigrationHost): void {
  if (provider instanceof Map) {
    if (!provider.has('provide') || provider.has('useValue') || provider.has('useFactory') ||
        provider.has('useExisting')) {
      return;
    }
    if (provider.has('useClass')) {
      // {provide: ..., useClass: SomeClass, deps: [...]} does not require a decorator on SomeClass,
      // as the provider itself configures 'deps'. Only if 'deps' is missing will this require a
      // factory to exist on SomeClass.
      if (!provider.has('deps')) {
        migrateProviderClass(provider.get('useClass')!, host);
      }
    } else {
      migrateProviderClass(provider.get('provide')!, host);
    }
  } else if (Array.isArray(provider)) {
    for (const v of provider) {
      migrateProvider(v, host);
    }
  } else {
    migrateProviderClass(provider, host);
  }
}

/**
 * Given a provider class, adds the `@Injectable()` decorator if no other relevant Angular decorator
 * is present on the class.
 *
 * 给定一个提供者类，如果类中不存在其他相关的 Angular 装饰器，则添加 `@Injectable()` 装饰器。
 *
 */
function migrateProviderClass(provider: ResolvedValue, host: MigrationHost): void {
  // Providers that do not refer to a class cannot be migrated.
  if (!(provider instanceof Reference)) {
    return;
  }

  const clazz = provider.node;
  if (isClassDeclaration(clazz) && host.isInScope(clazz) && needsInjectableDecorator(clazz, host)) {
    host.injectSyntheticDecorator(clazz, createInjectableDecorator(clazz));
  }
}

const NO_MIGRATE_DECORATORS = new Set(['Injectable', 'Directive', 'Component', 'Pipe']);

/**
 * Determines if the given class needs to be decorated with `@Injectable()` based on whether it
 * already has an Angular decorator applied.
 *
 * 根据给定类是否已经应用了 Angular 装饰器，确定给定类是否需要使用 `@Injectable()` 装饰。
 *
 */
function needsInjectableDecorator(clazz: ClassDeclaration, host: MigrationHost): boolean {
  const decorators = host.getAllDecorators(clazz);
  if (decorators === null) {
    return true;
  }

  for (const decorator of decorators) {
    const name = getAngularCoreDecoratorName(decorator);
    if (name !== null && NO_MIGRATE_DECORATORS.has(name)) {
      return false;
    }
  }

  return true;
}

/**
 * Determines the original name of a decorator if it is from '@angular/core'. For other decorators,
 * null is returned.
 *
 * 确定装饰器的原始名称是否来自 '@angular/core'。对于其他装饰器，返回 null 。
 *
 */
export function getAngularCoreDecoratorName(decorator: Decorator): string|null {
  if (decorator.import === null || decorator.import.from !== '@angular/core') {
    return null;
  }

  return decorator.import.name;
}
