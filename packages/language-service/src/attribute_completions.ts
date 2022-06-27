/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CssSelector, SelectorMatcher, TmplAstElement, TmplAstTemplate} from '@angular/compiler';
import {DirectiveInScope, ElementSymbol, TemplateSymbol, TemplateTypeChecker, TypeCheckableDirectiveMeta} from '@angular/compiler-cli/src/ngtsc/typecheck/api';
import ts from 'typescript';

import {DisplayInfoKind, unsafeCastDisplayInfoKindToScriptElementKind} from './display_parts';
import {makeElementSelector} from './utils';

/**
 * Differentiates different kinds of `AttributeCompletion`s.
 *
 * 区分不同类型的 `AttributeCompletion` 。
 *
 */
export enum AttributeCompletionKind {
  /**
   * Completion of an attribute from the HTML schema.
   *
   * 完成 HTML 模式中的属性。
   *
   * Attributes often have a corresponding DOM property of the same name.
   *
   * 属性通常有一个对应的同名 DOM 属性。
   *
   */
  DomAttribute,

  /**
   * Completion of a property from the DOM schema.
   *
   * DOM 模式中属性的自动完成。
   *
   * `DomProperty` completions are generated only for properties which don't share their name with
   * an HTML attribute.
   *
   * 只有为不与 HTML 属性共享名称的属性生成 `DomProperty` 完成。
   *
   */
  DomProperty,

  /**
   * Completion of an event from the DOM schema.
   *
   * DOM 模式中事件的完成。
   *
   */
  DomEvent,

  /**
   * Completion of an attribute that results in a new directive being matched on an element.
   *
   * 导致在元素上匹配新指令的属性的完成。
   *
   */
  DirectiveAttribute,

  /**
   * Completion of an attribute that results in a new structural directive being matched on an
   * element.
   *
   * 导致在元素上匹配新的结构指令的属性的完成。
   *
   */
  StructuralDirectiveAttribute,

  /**
   * Completion of an input from a directive which is either present on the element, or becomes
   * present after the addition of this attribute.
   *
   * 指令中存在的输入或在添加此属性后变得存在的完成。
   *
   */
  DirectiveInput,

  /**
   * Completion of an output from a directive which is either present on the element, or becomes
   * present after the addition of this attribute.
   *
   * 指令的输出的完成，该输出存在于元素上，或在添加此属性后变得存在。
   *
   */
  DirectiveOutput,
}

/**
 * Completion of an attribute from the DOM schema.
 *
 * DOM 模式中属性的自动完成。
 *
 */
export interface DomAttributeCompletion {
  kind: AttributeCompletionKind.DomAttribute;

  /**
   * Name of the HTML attribute (not to be confused with the corresponding DOM property name).
   *
   * HTML 属性的名称（不要与相应的 DOM 属性名称混淆）。
   *
   */
  attribute: string;

  /**
   * Whether this attribute is also a DOM property. Note that this is required to be `true` because
   * we only want to provide DOM attributes when there is an Angular syntax associated with them
   * (`[propertyName]=""`).
   *
   * 此属性是否也是 DOM 属性。请注意，这必须是 `true` ，因为我们只想在有 Angular 语法（
   * `[propertyName]=""` ）关联的 Angular 语法时提供 DOM 属性。
   *
   */
  isAlsoProperty: true;
}

/**
 * Completion of a DOM property of an element that's distinct from an HTML attribute.
 *
 * 与 HTML 属性不同的元素的 DOM 属性的自动完成。
 *
 */
export interface DomPropertyCompletion {
  kind: AttributeCompletionKind.DomProperty;

  /**
   * Name of the DOM property
   *
   * DOM 属性的名称
   *
   */
  property: string;
}

export interface DomEventCompletion {
  kind: AttributeCompletionKind.DomEvent;

  /**
   * Name of the DOM event
   *
   * DOM 事件的名称
   *
   */
  eventName: string;
}

/**
 * Completion of an attribute which results in a new directive being matched on an element.
 *
 * 属性的完成，这会导致在元素上匹配新指令。
 *
 */
export interface DirectiveAttributeCompletion {
  kind: AttributeCompletionKind.DirectiveAttribute|
      AttributeCompletionKind.StructuralDirectiveAttribute;

  /**
   * Name of the attribute whose addition causes this directive to match the element.
   *
   * 属性的名称，其添加会导致此指令与元素匹配。
   *
   */
  attribute: string;

  /**
   * The directive whose selector gave rise to this completion.
   *
   * 其选择器导致此自动完成的指令。
   *
   */
  directive: DirectiveInScope;
}

/**
 * Completion of an input of a directive which may either be present on the element, or become
 * present when a binding to this input is added.
 *
 * 指令的输入的完成，该指令可能存在于元素上，也可能是添加到此输入的绑定时出现的。
 *
 */
export interface DirectiveInputCompletion {
  kind: AttributeCompletionKind.DirectiveInput;

  /**
   * The public property name of the input (the name which would be used in any binding to that
   * input).
   *
   * 输入的公共属性名称（将在与该输入的任何绑定中使用的名称）。
   *
   */
  propertyName: string;

  /**
   * The directive which has this input.
   *
   * 具有此输入的指令。
   *
   */
  directive: DirectiveInScope;

  /**
   * The field name on the directive class which corresponds to this input.
   *
   * 指令类上与此输入对应的字段名称。
   *
   * Currently, in the case where a single property name corresponds to multiple input fields, only
   * the first such field is represented here. In the future multiple results may be warranted.
   *
   * 当前，在单个属性名称对应于多个输入字段的情况下，这里仅表示第一个这样的字段。在未来，可能需要多重结果。
   *
   */
  classPropertyName: string;

  /**
   * Whether this input can be used with two-way binding (that is, whether a corresponding change
   * output exists on the directive).
   *
   * 此输入是否可以与双向绑定一起使用（即，指令中是否存在相应的更改输出）。
   *
   */
  twoWayBindingSupported: boolean;
}

export interface DirectiveOutputCompletion {
  kind: AttributeCompletionKind.DirectiveOutput;

  /**
   * The public event name of the output (the name which would be used in any binding to that
   * output).
   *
   * 输出的公共事件名称（在与该输出的任何绑定中使用的名称）。
   *
   */
  eventName: string;

  /**
   * The directive which has this output.
   *
   * 具有此输出的指令。
   *
   */
  directive: DirectiveInScope;

  /**
   * The field name on the directive class which corresponds to this output.
   *
   * 与此输出对应的指令类上的字段名称。
   *
   */
  classPropertyName: string;
}

/**
 * Any named attribute which is available for completion on a given element.
 *
 * 任何可在给定元素上自动完成的命名属性。
 *
 * Disambiguated by the `kind` property into various types of completions.
 *
 * 由 `kind` 属性消歧为各种类型的自动完成。
 *
 */
export type AttributeCompletion =
    DomAttributeCompletion|DomPropertyCompletion|DirectiveAttributeCompletion|
    DirectiveInputCompletion|DirectiveOutputCompletion|DomEventCompletion;

/**
 * Given an element and its context, produce a `Map` of all possible attribute completions.
 *
 * 给定一个元素及其上下文，生成所有可能的属性自动完成的 `Map` 。
 *
 * 3 kinds of attributes are considered for completion, from highest to lowest priority:
 *
 * 会考虑完成 3 种属性，从最高到最低优先级：
 *
 * 1. Inputs/outputs of directives present on the element already.
 *
 *    元素上已经存在的指令的输入/输出。
 *
 * 2. Inputs/outputs of directives that are not present on the element, but which would become
 *    present if such a binding is added.
 *
 *    元素上不存在的指令的输入/输出，但如果添加这样的绑定就会出现。
 *
 * 3. Attributes from the DOM schema for the element.
 *
 *    来自元素的 DOM 模式的属性。
 *
 * The priority of these options determines which completions are added to the `Map`. If a directive
 * input shares the same name as a DOM attribute, the `Map` will reflect the directive input
 * completion, not the DOM completion for that name.
 *
 * 这些选项的优先级确定将哪些自动完成添加到 `Map` 。如果指令输入与 DOM 属性同名，则 `Map`
 * 将反映指令输入自动完成，而不是该名称的 DOM 自动完成。
 *
 */
export function buildAttributeCompletionTable(
    component: ts.ClassDeclaration, element: TmplAstElement|TmplAstTemplate,
    checker: TemplateTypeChecker): Map<string, AttributeCompletion> {
  const table = new Map<string, AttributeCompletion>();

  // Use the `ElementSymbol` or `TemplateSymbol` to iterate over directives present on the node, and
  // their inputs/outputs. These have the highest priority of completion results.
  const symbol: ElementSymbol|TemplateSymbol =
      checker.getSymbolOfNode(element, component) as ElementSymbol | TemplateSymbol;
  const presentDirectives = new Set<ts.ClassDeclaration>();
  if (symbol !== null) {
    // An `ElementSymbol` was available. This means inputs and outputs for directives on the
    // element can be added to the completion table.
    for (const dirSymbol of symbol.directives) {
      const directive = dirSymbol.tsSymbol.valueDeclaration;
      if (!ts.isClassDeclaration(directive)) {
        continue;
      }
      presentDirectives.add(directive);

      const meta = checker.getDirectiveMetadata(directive);
      if (meta === null) {
        continue;
      }

      for (const [classPropertyName, propertyName] of meta.inputs) {
        if (table.has(propertyName)) {
          continue;
        }

        table.set(propertyName, {
          kind: AttributeCompletionKind.DirectiveInput,
          propertyName,
          directive: dirSymbol,
          classPropertyName,
          twoWayBindingSupported: meta.outputs.hasBindingPropertyName(propertyName + 'Change'),
        });
      }

      for (const [classPropertyName, propertyName] of meta.outputs) {
        if (table.has(propertyName)) {
          continue;
        }

        table.set(propertyName, {
          kind: AttributeCompletionKind.DirectiveOutput,
          eventName: propertyName,
          directive: dirSymbol,
          classPropertyName,
        });
      }
    }
  }

  // Next, explore hypothetical directives and determine if the addition of any single attributes
  // can cause the directive to match the element.
  const directivesInScope = checker.getDirectivesInScope(component);
  if (directivesInScope !== null) {
    const elementSelector = makeElementSelector(element);

    for (const dirInScope of directivesInScope) {
      const directive = dirInScope.tsSymbol.valueDeclaration;
      // Skip directives that are present on the element.
      if (!ts.isClassDeclaration(directive) || presentDirectives.has(directive)) {
        continue;
      }

      const meta = checker.getDirectiveMetadata(directive);
      if (meta === null || meta.selector === null) {
        continue;
      }

      if (!meta.isStructural) {
        // For non-structural directives, the directive's attribute selector(s) are matched against
        // a hypothetical version of the element with those attributes. A match indicates that
        // adding that attribute/input/output binding would cause the directive to become present,
        // meaning that such a binding is a valid completion.
        const selectors = CssSelector.parse(meta.selector);
        const matcher = new SelectorMatcher();
        matcher.addSelectables(selectors);

        for (const selector of selectors) {
          for (const [attrName, attrValue] of selectorAttributes(selector)) {
            if (attrValue !== '') {
              // This attribute selector requires a value, which is not supported in completion.
              continue;
            }

            if (table.has(attrName)) {
              // Skip this attribute as there's already a binding for it.
              continue;
            }

            // Check whether adding this attribute would cause the directive to start matching.
            const newElementSelector = elementSelector + `[${attrName}]`;
            if (!matcher.match(CssSelector.parse(newElementSelector)[0], null)) {
              // Nope, move on with our lives.
              continue;
            }

            // Adding this attribute causes a new directive to be matched. Decide how to categorize
            // it based on the directive's inputs and outputs.
            if (meta.inputs.hasBindingPropertyName(attrName)) {
              // This attribute corresponds to an input binding.
              table.set(attrName, {
                kind: AttributeCompletionKind.DirectiveInput,
                directive: dirInScope,
                propertyName: attrName,
                classPropertyName:
                    meta.inputs.getByBindingPropertyName(attrName)![0].classPropertyName,
                twoWayBindingSupported: meta.outputs.hasBindingPropertyName(attrName + 'Change'),
              });
            } else if (meta.outputs.hasBindingPropertyName(attrName)) {
              // This attribute corresponds to an output binding.
              table.set(attrName, {
                kind: AttributeCompletionKind.DirectiveOutput,
                directive: dirInScope,
                eventName: attrName,
                classPropertyName:
                    meta.outputs.getByBindingPropertyName(attrName)![0].classPropertyName,
              });
            } else {
              // This attribute causes a new directive to be matched, but does not also correspond
              // to an input or output binding.
              table.set(attrName, {
                kind: AttributeCompletionKind.DirectiveAttribute,
                attribute: attrName,
                directive: dirInScope,
              });
            }
          }
        }
      } else {
        // Hypothetically matching a structural directive is a litle different than a plain
        // directive. Use of the '*' structural directive syntactic sugar means that the actual
        // directive is applied to a plain <ng-template> node, not the existing element with any
        // other attributes it might already have.
        // Additionally, more than one attribute/input might need to be present in order for the
        // directive to match (e.g. `ngFor` has a selector of `[ngFor][ngForOf]`). This gets a
        // little tricky.

        const structuralAttributes = getStructuralAttributes(meta);
        for (const attrName of structuralAttributes) {
          table.set(attrName, {
            kind: AttributeCompletionKind.StructuralDirectiveAttribute,
            attribute: attrName,
            directive: dirInScope,
          });
        }
      }
    }
  }

  // Finally, add any DOM attributes not already covered by inputs.
  if (element instanceof TmplAstElement) {
    for (const {attribute, property} of checker.getPotentialDomBindings(element.name)) {
      const isAlsoProperty = attribute === property;
      if (!table.has(attribute) && isAlsoProperty) {
        table.set(attribute, {
          kind: AttributeCompletionKind.DomAttribute,
          attribute,
          isAlsoProperty,
        });
      }
    }
    for (const event of checker.getPotentialDomEvents(element.name)) {
      table.set(event, {
        kind: AttributeCompletionKind.DomEvent,
        eventName: event,
      });
    }
  }
  return table;
}

function buildSnippet(insertSnippet: true|undefined, text: string): string|undefined {
  return insertSnippet ? `${text}="$1"` : undefined;
}

/**
 * Used to ensure Angular completions appear before DOM completions. Inputs and Outputs are
 * prioritized first while attributes which would match an additional directive are prioritized
 * second.
 *
 * 用于确保 Angular 自动完成出现在 DOM 自动完成之前。输入和输出优先，而与附加指令匹配的属性优先。
 *
 * This sort priority is based on the ASCII table. Other than `space`, the `!` is the first
 * printable character in the ASCII ordering.
 *
 * 此排序优先级基于 ASCII 表。除了 `space` ， `!` 是 ASCII 顺序中的第一个可打印字符。
 *
 */
enum AsciiSortPriority {
  First = '!',
  Second = '"',
}

/**
 * Given an `AttributeCompletion`, add any available completions to a `ts.CompletionEntry` array of
 * results.
 *
 * 给定一个 `AttributeCompletion` ，将任何可用的自动完成添加到 `ts.CompletionEntry` 的结果数组。
 *
 * The kind of completions generated depends on whether the current context is an attribute context
 * or not. For example, completing on `<element attr|>` will generate two results: `attribute` and
 * `[attribute]` - either a static attribute can be generated, or a property binding. However,
 * `<element [attr|]>` is not an attribute context, and so only the property completion `attribute`
 * is generated. Note that this completion does not have the `[]` property binding sugar as its
 * implicitly present in a property binding context (we're already completing within an `[attr|]`
 * expression).
 *
 * 生成的自动完成类型取决于当前上下文是否是属性上下文。例如，在 `<element attr|>`
 * 上完成将生成两个结果： `attribute` 和 `[attribute]` -
 * 可以生成静态属性，也可以生成属性绑定。但是， `<element [attr|]>` 不是属性上下文，因此只会生成
 * property 自动完成 `attribute` 。请注意，此自动完成没有 `[]`
 * 属性绑定糖，因为它隐式存在于属性绑定上下文中（我们已经在 `[attr|]` 表达式中完成）。
 *
 * If the `insertSnippet` is `true`, the completion entries should includes the property or event
 * binding sugar in some case. For Example `<div (my¦) />`, the `replacementSpan` is `(my)`, and the
 * `insertText` is `(myOutput)="$0"`.
 *
 * 如果 `insertSnippet` 为 `true` ，则在某些情况下，自动完成条目应该包含属性或事件绑定糖。例如 `<div
 * (my¦) />` ， `replacementSpan` 是 `(my)` ， `insertText` 是 `(myOutput)="$0"` 。
 *
 */
export function addAttributeCompletionEntries(
    entries: ts.CompletionEntry[], completion: AttributeCompletion, isAttributeContext: boolean,
    isElementContext: boolean, replacementSpan: ts.TextSpan|undefined,
    insertSnippet: true|undefined): void {
  switch (completion.kind) {
    case AttributeCompletionKind.DirectiveAttribute: {
      entries.push({
        kind: unsafeCastDisplayInfoKindToScriptElementKind(DisplayInfoKind.DIRECTIVE),
        name: completion.attribute,
        sortText: AsciiSortPriority.Second + completion.attribute,
        replacementSpan,
      });
      break;
    }
    case AttributeCompletionKind.StructuralDirectiveAttribute: {
      // In an element, the completion is offered with a leading '*' to activate the structural
      // directive. Once present, the structural attribute will be parsed as a template and not an
      // element, and the prefix is no longer necessary.
      const prefix = isElementContext ? '*' : '';
      entries.push({
        kind: unsafeCastDisplayInfoKindToScriptElementKind(DisplayInfoKind.DIRECTIVE),
        name: prefix + completion.attribute,
        insertText: buildSnippet(insertSnippet, prefix + completion.attribute),
        isSnippet: insertSnippet,
        sortText: AsciiSortPriority.Second + prefix + completion.attribute,
        replacementSpan,
      });
      break;
    }
    case AttributeCompletionKind.DirectiveInput: {
      if (isAttributeContext || insertSnippet) {
        // Offer a completion of a property binding.
        entries.push({
          kind: unsafeCastDisplayInfoKindToScriptElementKind(DisplayInfoKind.PROPERTY),
          name: `[${completion.propertyName}]`,
          insertText: buildSnippet(insertSnippet, `[${completion.propertyName}]`),
          isSnippet: insertSnippet,
          sortText: AsciiSortPriority.First + completion.propertyName,
          replacementSpan,
        });
        // If the directive supports banana-in-a-box for this input, offer that as well.
        if (completion.twoWayBindingSupported) {
          entries.push({
            kind: unsafeCastDisplayInfoKindToScriptElementKind(DisplayInfoKind.PROPERTY),
            name: `[(${completion.propertyName})]`,
            insertText: buildSnippet(insertSnippet, `[(${completion.propertyName})]`),
            isSnippet: insertSnippet,
            // This completion should sort after the property binding.
            sortText: AsciiSortPriority.First + completion.propertyName + '_1',
            replacementSpan,
          });
        }
        // Offer a completion of the input binding as an attribute.
        entries.push({
          kind: unsafeCastDisplayInfoKindToScriptElementKind(DisplayInfoKind.ATTRIBUTE),
          name: completion.propertyName,
          insertText: buildSnippet(insertSnippet, completion.propertyName),
          isSnippet: insertSnippet,
          // This completion should sort after both property binding options (one-way and two-way).
          sortText: AsciiSortPriority.First + completion.propertyName + '_2',
          replacementSpan,
        });
      } else {
        entries.push({
          kind: unsafeCastDisplayInfoKindToScriptElementKind(DisplayInfoKind.PROPERTY),
          name: completion.propertyName,
          insertText: buildSnippet(insertSnippet, completion.propertyName),
          isSnippet: insertSnippet,
          sortText: AsciiSortPriority.First + completion.propertyName,
          replacementSpan,
        });
      }
      break;
    }
    case AttributeCompletionKind.DirectiveOutput: {
      if (isAttributeContext || insertSnippet) {
        entries.push({
          kind: unsafeCastDisplayInfoKindToScriptElementKind(DisplayInfoKind.EVENT),
          name: `(${completion.eventName})`,
          insertText: buildSnippet(insertSnippet, `(${completion.eventName})`),
          isSnippet: insertSnippet,
          sortText: AsciiSortPriority.First + completion.eventName,
          replacementSpan,
        });
      } else {
        entries.push({
          kind: unsafeCastDisplayInfoKindToScriptElementKind(DisplayInfoKind.EVENT),
          name: completion.eventName,
          insertText: buildSnippet(insertSnippet, completion.eventName),
          isSnippet: insertSnippet,
          sortText: AsciiSortPriority.First + completion.eventName,
          replacementSpan,
        });
      }
      break;
    }
    case AttributeCompletionKind.DomAttribute: {
      if ((isAttributeContext || insertSnippet) && completion.isAlsoProperty) {
        // Offer a completion of a property binding to the DOM property.
        entries.push({
          kind: unsafeCastDisplayInfoKindToScriptElementKind(DisplayInfoKind.PROPERTY),
          name: `[${completion.attribute}]`,
          insertText: buildSnippet(insertSnippet, `[${completion.attribute}]`),
          isSnippet: insertSnippet,
          // In the case of DOM attributes, the property binding should sort after the attribute
          // binding.
          sortText: completion.attribute + '_1',
          replacementSpan,
        });
      }
      break;
    }
    case AttributeCompletionKind.DomProperty: {
      if (!isAttributeContext) {
        entries.push({
          kind: unsafeCastDisplayInfoKindToScriptElementKind(DisplayInfoKind.PROPERTY),
          name: completion.property,
          insertText: buildSnippet(insertSnippet, completion.property),
          isSnippet: insertSnippet,
          sortText: completion.property,
          replacementSpan,
        });
      }
      break;
    }
    case AttributeCompletionKind.DomEvent: {
      entries.push({
        kind: unsafeCastDisplayInfoKindToScriptElementKind(DisplayInfoKind.EVENT),
        name: `(${completion.eventName})`,
        insertText: buildSnippet(insertSnippet, `(${completion.eventName})`),
        isSnippet: insertSnippet,
        sortText: completion.eventName,
        replacementSpan,
      });
      break;
    }
  }
}

export function getAttributeCompletionSymbol(
    completion: AttributeCompletion, checker: ts.TypeChecker): ts.Symbol|null {
  switch (completion.kind) {
    case AttributeCompletionKind.DomAttribute:
    case AttributeCompletionKind.DomEvent:
    case AttributeCompletionKind.DomProperty:
      return null;
    case AttributeCompletionKind.DirectiveAttribute:
    case AttributeCompletionKind.StructuralDirectiveAttribute:
      return completion.directive.tsSymbol;
    case AttributeCompletionKind.DirectiveInput:
    case AttributeCompletionKind.DirectiveOutput:
      return checker.getDeclaredTypeOfSymbol(completion.directive.tsSymbol)
                 .getProperty(completion.classPropertyName) ??
          null;
  }
}

/**
 * Iterates over `CssSelector` attributes, which are internally represented in a zipped array style
 * which is not conducive to straightforward iteration.
 *
 * 迭代 `CssSelector` 属性，这些属性在内部以压缩数组风格表示，不利于直接迭代。
 *
 */
function* selectorAttributes(selector: CssSelector): Iterable<[string, string]> {
  for (let i = 0; i < selector.attrs.length; i += 2) {
    yield [selector.attrs[0], selector.attrs[1]];
  }
}

function getStructuralAttributes(meta: TypeCheckableDirectiveMeta): string[] {
  if (meta.selector === null) {
    return [];
  }

  const structuralAttributes: string[] = [];
  const selectors = CssSelector.parse(meta.selector);
  for (const selector of selectors) {
    if (selector.element !== null && selector.element !== 'ng-template') {
      // This particular selector does not apply under structural directive syntax.
      continue;
    }

    // Every attribute of this selector must be name-only - no required values.
    const attributeSelectors = Array.from(selectorAttributes(selector));
    if (!attributeSelectors.every(([_, attrValue]) => attrValue === '')) {
      continue;
    }

    // Get every named selector.
    const attributes = attributeSelectors.map(([attrName, _]) => attrName);

    // Find the shortest attribute. This is the structural directive "base", and all potential
    // input bindings must begin with the base. E.g. in `*ngFor="let a of b"`, `ngFor` is the
    // base attribute, and the `of` binding key corresponds to an input of `ngForOf`.
    const baseAttr = attributes.reduce(
        (prev, curr) => prev === null || curr.length < prev.length ? curr : prev,
        null as string | null);
    if (baseAttr === null) {
      // No attributes in this selector?
      continue;
    }

    // Validate that the attributes are compatible with use as a structural directive.
    const isValid = (attr: string): boolean => {
      // The base attribute is valid by default.
      if (attr === baseAttr) {
        return true;
      }

      // Non-base attributes must all be prefixed with the base attribute.
      if (!attr.startsWith(baseAttr)) {
        return false;
      }

      // Non-base attributes must also correspond to directive inputs.
      if (!meta.inputs.hasBindingPropertyName(attr)) {
        return false;
      }

      // This attribute is compatible.
      return true;
    };

    if (!attributes.every(isValid)) {
      continue;
    }

    // This attribute is valid as a structural attribute for this directive.
    structuralAttributes.push(baseAttr);
  }

  return structuralAttributes;
}

export function buildAnimationCompletionEntries(
    animations: string[], replacementSpan: ts.TextSpan,
    kind: DisplayInfoKind): ts.CompletionEntry[] {
  return animations.map(animation => {
    return {
      kind: unsafeCastDisplayInfoKindToScriptElementKind(kind),
      name: animation,
      sortText: animation,
      replacementSpan,
    };
  });
}
