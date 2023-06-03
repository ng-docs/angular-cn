/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {resolveForwardRef} from '../../di';
import {RuntimeError, RuntimeErrorCode} from '../../errors';
import {Type} from '../../interface/type';
import {assertEqual} from '../../util/assert';
import {EMPTY_OBJ} from '../../util/empty';
import {getComponentDef, getDirectiveDef} from '../definition';
import {DirectiveDef, HostDirectiveBindingMap, HostDirectiveDef, HostDirectiveDefs} from '../interfaces/definition';

/**
 * Values that can be used to define a host directive through the `HostDirectivesFeature`.
 *
 * 可用于通过 `HostDirectivesFeature` 定义主机指令的值。
 *
 */
type HostDirectiveConfig = Type<unknown>|{
  directive: Type<unknown>;
  inputs?: string[];
  outputs?: string[];
};

/**
 * This feature adds the host directives behavior to a directive definition by patching a
 * function onto it. The expectation is that the runtime will invoke the function during
 * directive matching.
 *
 * 此功能通过将函数修补到指令定义上，将主机指令行为添加到指令定义中。 期望运行时将在指令匹配期间调用该函数。
 *
 * For example:
 *
 * 比如：
 *
 * ```ts
 * class ComponentWithHostDirective {
 *   static ɵcmp = defineComponent({
 *    type: ComponentWithHostDirective,
 *    features: [ɵɵHostDirectivesFeature([
 *      SimpleHostDirective,
 *      {directive: AdvancedHostDirective, inputs: ['foo: alias'], outputs: ['bar']},
 *    ])]
 *  });
 * }
 * ```
 *
 * @codeGenApi
 */
export function ɵɵHostDirectivesFeature(rawHostDirectives: HostDirectiveConfig[]|
                                        (() => HostDirectiveConfig[])) {
  return (definition: DirectiveDef<unknown>) => {
    definition.findHostDirectiveDefs = findHostDirectiveDefs;
    definition.hostDirectives =
        (Array.isArray(rawHostDirectives) ? rawHostDirectives : rawHostDirectives()).map(dir => {
          return typeof dir === 'function' ?
              {directive: resolveForwardRef(dir), inputs: EMPTY_OBJ, outputs: EMPTY_OBJ} :
              {
                directive: resolveForwardRef(dir.directive),
                inputs: bindingArrayToMap(dir.inputs),
                outputs: bindingArrayToMap(dir.outputs)
              };
        });
  };
}

function findHostDirectiveDefs(
    currentDef: DirectiveDef<unknown>, matchedDefs: DirectiveDef<unknown>[],
    hostDirectiveDefs: HostDirectiveDefs): void {
  if (currentDef.hostDirectives !== null) {
    for (const hostDirectiveConfig of currentDef.hostDirectives) {
      const hostDirectiveDef = getDirectiveDef(hostDirectiveConfig.directive)!;

      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        validateHostDirective(hostDirectiveConfig, hostDirectiveDef, matchedDefs);
      }

      // We need to patch the `declaredInputs` so that
      // `ngOnChanges` can map the properties correctly.
      patchDeclaredInputs(hostDirectiveDef.declaredInputs, hostDirectiveConfig.inputs);

      // Host directives execute before the host so that its host bindings can be overwritten.
      findHostDirectiveDefs(hostDirectiveDef, matchedDefs, hostDirectiveDefs);
      hostDirectiveDefs.set(hostDirectiveDef, hostDirectiveConfig);
      matchedDefs.push(hostDirectiveDef);
    }
  }
}

/**
 * Converts an array in the form of `['publicName', 'alias', 'otherPublicName', 'otherAlias']` into
 * a map in the form of `{publicName: 'alias', otherPublicName: 'otherAlias'}`.
 *
 * 将 `['publicName', 'alias', 'otherPublicName', 'otherAlias']` 形式的数组转换为 `{publicName: 'alias', otherPublicName: 'otherAlias'}` 形式的映射。
 *
 */
function bindingArrayToMap(bindings: string[]|undefined): HostDirectiveBindingMap {
  if (bindings === undefined || bindings.length === 0) {
    return EMPTY_OBJ;
  }

  const result: HostDirectiveBindingMap = {};

  for (let i = 0; i < bindings.length; i += 2) {
    result[bindings[i]] = bindings[i + 1];
  }

  return result;
}

/**
 * `ngOnChanges` has some leftover legacy ViewEngine behavior where the keys inside the
 * `SimpleChanges` event refer to the *declared* name of the input, not its public name or its
 * minified name. E.g. in `@Input('alias') foo: string`, the name in the `SimpleChanges` object
 * will always be `foo`, and not `alias` or the minified name of `foo` in apps using property
 * minification.
 *
 * `ngOnChanges` 有一些遗留的旧 ViewEngine 行为，其中 `SimpleChanges` 事件中的键指的是输入的*声明*名称，而不是其公共名称或其缩小名称。 例如，在 `@Input('alias') foo: string` 中， `SimpleChanges` 对象中的名称将始终是 `foo` ，而不是使用属性缩小的应用程序中 `foo` 的 `alias` 或缩小名称。
 *
 * This is achieved through the `DirectiveDef.declaredInputs` map that is constructed when the
 * definition is declared. When a property is written to the directive instance, the
 * `NgOnChangesFeature` will try to remap the property name being written to using the
 * `declaredInputs`.
 *
 * 这是通过在声明定义时构造的 `DirectiveDef.declaredInputs` 映射来实现的。 当属性被写入指令实例时， `NgOnChangesFeature` 将尝试使用 `declaredInputs` 重新映射正在写入的属性名称。
 *
 * Since the host directive input remapping happens during directive matching, `declaredInputs`
 * won't contain the new alias that the input is available under. This function addresses the
 * issue by patching the host directive aliases to the `declaredInputs`. There is *not* a risk of
 * this patching accidentally introducing new inputs to the host directive, because `declaredInputs`
 * is used *only* by the `NgOnChangesFeature` when determining what name is used in the
 * `SimpleChanges` object which won't be reached if an input doesn't exist.
 *
 * 由于主机指令输入重新映射发生在指令匹配期间，因此 `declaredInputs` 将不包含输入可用的新别名。 此函数通过将主机指令别名修补到 `declaredInputs` 来解决此问题。 *不*存在此修补意外向主机指令引入新输入的风险，因为 `declaredInputs`*仅*由 `NgOnChangesFeature` 在确定 `SimpleChanges` 对象中使用的名称时使用，如果输入不存在则无法访问。
 *
 */
function patchDeclaredInputs(
    declaredInputs: Record<string, string>, exposedInputs: HostDirectiveBindingMap): void {
  for (const publicName in exposedInputs) {
    if (exposedInputs.hasOwnProperty(publicName)) {
      const remappedPublicName = exposedInputs[publicName];
      const privateName = declaredInputs[publicName];

      // We *technically* shouldn't be able to hit this case because we can't have multiple
      // inputs on the same property and we have validations against conflicting aliases in
      // `validateMappings`. If we somehow did, it would lead to `ngOnChanges` being invoked
      // with the wrong name so we have a non-user-friendly assertion here just in case.
      if ((typeof ngDevMode === 'undefined' || ngDevMode) &&
          declaredInputs.hasOwnProperty(remappedPublicName)) {
        assertEqual(
            declaredInputs[remappedPublicName], declaredInputs[publicName],
            `Conflicting host directive input alias ${publicName}.`);
      }

      declaredInputs[remappedPublicName] = privateName;
    }
  }
}

/**
 * Verifies that the host directive has been configured correctly.
 *
 * 验证主机指令是否已正确配置。
 *
 * @param hostDirectiveConfig Host directive configuration object.
 *
 * 主机指令配置对象。
 *
 * @param directiveDef Directive definition of the host directive.
 *
 * 主机指令的指令定义。
 *
 * @param matchedDefs Directives that have been matched so far.
 *
 * 到目前为止已匹配的指令。
 *
 */
function validateHostDirective(
    hostDirectiveConfig: HostDirectiveDef<unknown>, directiveDef: DirectiveDef<any>|null,
    matchedDefs: DirectiveDef<unknown>[]): asserts directiveDef is DirectiveDef<unknown> {
  const type = hostDirectiveConfig.directive;

  if (directiveDef === null) {
    if (getComponentDef(type) !== null) {
      throw new RuntimeError(
          RuntimeErrorCode.HOST_DIRECTIVE_COMPONENT,
          `Host directive ${type.name} cannot be a component.`);
    }

    throw new RuntimeError(
        RuntimeErrorCode.HOST_DIRECTIVE_UNRESOLVABLE,
        `Could not resolve metadata for host directive ${type.name}. ` +
            `Make sure that the ${type.name} class is annotated with an @Directive decorator.`);
  }

  if (!directiveDef.standalone) {
    throw new RuntimeError(
        RuntimeErrorCode.HOST_DIRECTIVE_NOT_STANDALONE,
        `Host directive ${directiveDef.type.name} must be standalone.`);
  }

  if (matchedDefs.indexOf(directiveDef) > -1) {
    throw new RuntimeError(
        RuntimeErrorCode.DUPLICATE_DIRECTITVE,
        `Directive ${directiveDef.type.name} matches multiple times on the same element. ` +
            `Directives can only match an element once.`);
  }

  validateMappings('input', directiveDef, hostDirectiveConfig.inputs);
  validateMappings('output', directiveDef, hostDirectiveConfig.outputs);
}

/**
 * Checks that the host directive inputs/outputs configuration is valid.
 *
 * 检查主机指令输入/输出配置是否有效。
 *
 * @param bindingType Kind of binding that is being validated. Used in the error message.
 *
 * 正在验证的绑定类型。 在错误消息中使用。
 *
 * @param def Definition of the host directive that is being validated against.
 *
 * 正在验证的主机指令的定义。
 *
 * @param hostDirectiveBindings Host directive mapping object that shold be validated.
 *
 * 应验证的主机指令映射对象。
 *
 */
function validateMappings(
    bindingType: 'input'|'output', def: DirectiveDef<unknown>,
    hostDirectiveBindings: HostDirectiveBindingMap) {
  const className = def.type.name;
  const bindings: Record<string, string> = bindingType === 'input' ? def.inputs : def.outputs;

  for (const publicName in hostDirectiveBindings) {
    if (hostDirectiveBindings.hasOwnProperty(publicName)) {
      if (!bindings.hasOwnProperty(publicName)) {
        throw new RuntimeError(
            RuntimeErrorCode.HOST_DIRECTIVE_UNDEFINED_BINDING,
            `Directive ${className} does not have an ${bindingType} with a public name of ${
                publicName}.`);
      }

      const remappedPublicName = hostDirectiveBindings[publicName];

      if (bindings.hasOwnProperty(remappedPublicName) && remappedPublicName !== publicName &&
          bindings[remappedPublicName] !== publicName) {
        throw new RuntimeError(
            RuntimeErrorCode.HOST_DIRECTIVE_CONFLICTING_ALIAS,
            `Cannot alias ${bindingType} ${publicName} of host directive ${className} to ${
                remappedPublicName}, because it already has a different ${
                bindingType} with the same public name.`);
      }
    }
  }
}
