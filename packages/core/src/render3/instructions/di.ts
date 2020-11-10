/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {InjectFlags, InjectionToken, resolveForwardRef} from '../../di';
import {assertInjectImplementationNotEqual} from '../../di/inject_switch';
import {ɵɵinject} from '../../di/injector_compatibility';
import {Type} from '../../interface/type';
import {getOrCreateInjectable, injectAttributeImpl} from '../di';
import {TDirectiveHostNode} from '../interfaces/node';
import {getCurrentTNode, getLView} from '../state';

/**
 * Returns the value associated to the given token from the injectors.
 *
 * `directiveInject` is intended to be used for directive, component and pipe factories.
 *  All other injection use `inject` which does not walk the node injector tree.
 *
 * Usage example (in factory function):
 *
 * ```ts
 * class SomeDirective {
 *   constructor(directive: DirectiveA) {}
 *
 *   static ɵdir = ɵɵdefineDirective({
 *     type: SomeDirective,
 *     factory: () => new SomeDirective(ɵɵdirectiveInject(DirectiveA))
 *   });
 * }
 * ```
 * @param token the type or token to inject
 * @param flags Injection flags
 * @returns the value from the injector or `null` when not found
 *
 * @codeGenApi
 */
export function ɵɵdirectiveInject<T>(token: Type<T>|InjectionToken<T>): T;
export function ɵɵdirectiveInject<T>(token: Type<T>|InjectionToken<T>, flags: InjectFlags): T;
export function ɵɵdirectiveInject<T>(
    token: Type<T>|InjectionToken<T>, flags = InjectFlags.Default): T|null {
  const lView = getLView();
  // Fall back to inject() if view hasn't been created. This situation can happen in tests
  // if inject utilities are used before bootstrapping.
  if (lView === null) {
    // Verify that we will not get into infinite loop.
    ngDevMode && assertInjectImplementationNotEqual(ɵɵdirectiveInject);
    return ɵɵinject(token, flags);
  }
  const tNode = getCurrentTNode();
  return getOrCreateInjectable<T>(
      tNode as TDirectiveHostNode, lView, resolveForwardRef(token), flags);
}

/**
 * Facade for the attribute injection from DI.
 *
 * @codeGenApi
 */
export function ɵɵinjectAttribute(attrNameToInject: string): string|null {
  return injectAttributeImpl(getCurrentTNode()!, attrNameToInject);
}

/**
 * Throws an error indicating that a factory function could not be generated by the compiler for a
 * particular class.
 *
 * This instruction allows the actual error message to be optimized away when ngDevMode is turned
 * off, saving bytes of generated code while still providing a good experience in dev mode.
 *
 * The name of the class is not mentioned here, but will be in the generated factory function name
 * and thus in the stack trace.
 *
 * @codeGenApi
 */
export function ɵɵinvalidFactory(): never {
  const msg =
      ngDevMode ? `This constructor was not compatible with Dependency Injection.` : 'invalid';
  throw new Error(msg);
}
