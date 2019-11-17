/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// THIS CODE IS GENERATED - DO NOT MODIFY
// See angular/tools/gulp-tasks/cldr/extract.js

const u = undefined;

function plural(n: number): number {
  if (n === 1) return 1;
  return 5;
}

export default [
  'gsw-LI',
  [['vorm.', 'nam.'], u, ['am Vormittag', 'am Namittag']],
  [['vorm.', 'nam.'], u, ['Vormittag', 'Namittag']],
  [
    ['S', 'M', 'D', 'M', 'D', 'F', 'S'], ['Su.', 'Mä.', 'Zi.', 'Mi.', 'Du.', 'Fr.', 'Sa.'],
    ['Sunntig', 'Määntig', 'Ziischtig', 'Mittwuch', 'Dunschtig', 'Friitig', 'Samschtig'],
    ['Su.', 'Mä.', 'Zi.', 'Mi.', 'Du.', 'Fr.', 'Sa.']
  ],
  u,
  [
    ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'Auguscht', 'Septämber',
      'Oktoober', 'Novämber', 'Dezämber'
    ]
  ],
  u,
  [['v. Chr.', 'n. Chr.'], u, u],
  1,
  [6, 0],
  ['dd.MM.yy', 'dd.MM.y', 'd. MMMM y', 'EEEE, d. MMMM y'],
  ['HH:mm', 'HH:mm:ss', 'HH:mm:ss z', 'HH:mm:ss zzzz'],
  ['{1} {0}', u, u, u],
  ['.', '’', ';', '%', '+', '−', 'E', '×', '‰', '∞', 'NaN', ':'],
  ['#,##0.###', '#,##0 %', '#,##0.00 ¤', '#E0'],
  'CHF',
  'Schwiizer Franke',
  {'ATS': ['öS']},
  'ltr',
  plural
];
