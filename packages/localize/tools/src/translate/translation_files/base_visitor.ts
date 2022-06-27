/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Attribute, Comment, Element, Expansion, ExpansionCase, Text, Visitor} from '@angular/compiler';

/**
 * A simple base class for the  `Visitor` interface, which is a noop for every method.
 *
 * `Visitor` 接口的简单基类，对每个方法都是 noop。
 *
 * Sub-classes only need to override the methods that they care about.
 *
 * 子类只需要覆盖它们关心的方法。
 *
 */
export class BaseVisitor implements Visitor {
  visitElement(_element: Element, _context: any): any {}
  visitAttribute(_attribute: Attribute, _context: any): any {}
  visitText(_text: Text, _context: any): any {}
  visitComment(_comment: Comment, _context: any): any {}
  visitExpansion(_expansion: Expansion, _context: any): any {}
  visitExpansionCase(_expansionCase: ExpansionCase, _context: any): any {}
}
