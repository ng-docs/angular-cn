/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Used for stringify render output in Ivy.
 * Important! This function is very performance-sensitive and we should
 * be extra careful not to introduce megamorphic reads in it.
 */
export function renderStringify(value: any): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return '' + value;
}


/**
 * Used to stringify a value so that it can be displayed in an error message.
 * Important! This function contains a megamorphic read and should only be
 * used for error messages.
 */
export function stringifyForError(value: any): string {
  if (typeof value === 'function') return value.name || value.toString();
  if (typeof value === 'object' && value != null && typeof value.type === 'function') {
    return value.type.name || value.type.toString();
  }

  return renderStringify(value);
}
