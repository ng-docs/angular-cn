/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {runfiles} from '@bazel/runfiles';

import {CldrLocaleData} from './cldr-data';

// There are no types available for `cldr`.
const {load: createCldr} = await import('cldr' as any);

// Load once to avoid re-parsing CLDR XML data on every invocation.
const cldr = createCldr(runfiles.resolve('cldr_xml_data'));

/**
 * Returns the plural function for a locale.
 *
 * 返回区域设置的复数函数。
 *
 */
export function getPluralFunction(localeData: CldrLocaleData, withTypes = true) {
  // We use the resolved bundle for extracting the plural function. This matches with the
  // lookup logic used by other extractions in the tool (using `cldrjs`), and also ensures
  // we follow the CLDR-specified bundle lookup algorithm. A language does not necessarily
  // resolve directly to a bundle CLDR provides data for.
  const bundleName = localeData.attributes.bundle;
  let fn = cldr.extractPluralRuleFunction(bundleName).toString();

  const numberType = withTypes ? ': number' : '';
  fn = fn.replace(
             /function anonymous\(val[^)]+\)/g, `function plural(val${numberType})${numberType}`)
           // Since our generated plural functions only take numbers, we can eliminate some of
           // the logic generated by the `cldr` package (to reduce payload size).
           .replace(/n\s+=\s+Number\(val\)/, 'n = val')
           .replace(/if\s+\(isNaN\(n\)\)\s+throw Error\([^)]+\);/, '');

  // The replacement values must match the `Plural` enum from common.
  // We do not use the enum directly to avoid depending on that package.
  return fn.replace(/["']zero["']/, '0')
      .replace(/["']one["']/, '1')
      .replace(/["']two["']/, '2')
      .replace(/["']few["']/, '3')
      .replace(/["']many["']/, '4')
      .replace(/["']other["']/, '5');
}
