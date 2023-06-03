/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as core from '../../../../core';
import {splitNsName} from '../../../../ml_parser/tags';
import * as o from '../../../../output/output_ast';

/**
 * Enumeration of the types of attributes which can be applied to an element.
 *
 * 可应用于元素的属性类型的枚举。
 *
 */
export enum ElementAttributeKind {
  /**
   * Static attributes.
   *
   * 静态属性。
   *
   */
  Attribute,

  /**
   * Class bindings.
   *
   * 类绑定。
   *
   */
  Class,

  /**
   * Style bindings.
   *
   * 样式绑定。
   *
   */
  Style,

  /**
   * Dynamic property or attribute bindings.
   *
   * 动态属性或属性绑定。
   *
   */
  Binding,

  /**
   * Attributes on a template node.
   *
   * 模板节点上的属性。
   *
   */
  Template,

  /**
   * Internationalized attributes.
   *
   * 国际化属性。
   *
   */
  I18n,
}

const FLYWEIGHT_ARRAY: ReadonlyArray<o.Expression> = Object.freeze<o.Expression[]>([]);

/**
 * Container for all of the various kinds of attributes which are applied on an element.
 *
 * 应用于元素的所有各种属性的容器。
 *
 */
export class ElementAttributes {
  private known = new Set<string>();
  private byKind = new Map<ElementAttributeKind, o.Expression[]>;

  projectAs: string|null = null;

  get attributes(): ReadonlyArray<o.Expression> {
    return this.byKind.get(ElementAttributeKind.Attribute) ?? FLYWEIGHT_ARRAY;
  }

  get classes(): ReadonlyArray<o.Expression> {
    return this.byKind.get(ElementAttributeKind.Class) ?? FLYWEIGHT_ARRAY;
  }

  get styles(): ReadonlyArray<o.Expression> {
    return this.byKind.get(ElementAttributeKind.Style) ?? FLYWEIGHT_ARRAY;
  }

  get bindings(): ReadonlyArray<o.Expression> {
    return this.byKind.get(ElementAttributeKind.Binding) ?? FLYWEIGHT_ARRAY;
  }

  get template(): ReadonlyArray<o.Expression> {
    return this.byKind.get(ElementAttributeKind.Template) ?? FLYWEIGHT_ARRAY;
  }

  get i18n(): ReadonlyArray<o.Expression> {
    return this.byKind.get(ElementAttributeKind.I18n) ?? FLYWEIGHT_ARRAY;
  }

  add(kind: ElementAttributeKind, name: string, value: o.Expression|null): void {
    if (this.known.has(name)) {
      return;
    }
    this.known.add(name);
    const array = this.arrayFor(kind);
    array.push(...getAttributeNameLiterals(name));
    if (value !== null) {
      array.push(value);
    }
  }

  private arrayFor(kind: ElementAttributeKind): o.Expression[] {
    if (!this.byKind.has(kind)) {
      this.byKind.set(kind, []);
    }
    return this.byKind.get(kind)!;
  }
}

function getAttributeNameLiterals(name: string): o.LiteralExpr[] {
  const [attributeNamespace, attributeName] = splitNsName(name);
  const nameLiteral = o.literal(attributeName);

  if (attributeNamespace) {
    return [
      o.literal(core.AttributeMarker.NamespaceURI), o.literal(attributeNamespace), nameLiteral
    ];
  }

  return [nameLiteral];
}

export function assertIsElementAttributes(attrs: any): asserts attrs is ElementAttributes {
  if (!(attrs instanceof ElementAttributes)) {
    throw new Error(
        `AssertionError: ElementAttributes has already been coalesced into the view constants`);
  }
}
