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
  return 5;
}

export default [
  'rw', [['AM', 'PM'], u, u], u,
  [
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'], ['cyu.', 'mbe.', 'kab.', 'gtu.', 'kan.', 'gnu.', 'gnd.'],
    [
      'Ku cyumweru', 'Kuwa mbere', 'Kuwa kabiri', 'Kuwa gatatu', 'Kuwa kane', 'Kuwa gatanu',
      'Kuwa gatandatu'
    ],
    ['cyu.', 'mbe.', 'kab.', 'gtu.', 'kan.', 'gnu.', 'gnd.']
  ],
  u,
  [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    [
      'mut.', 'gas.', 'wer.', 'mat.', 'gic.', 'kam.', 'nya.', 'kan.', 'nze.', 'ukw.', 'ugu.', 'uku.'
    ],
    [
      'Mutarama', 'Gashyantare', 'Werurwe', 'Mata', 'Gicuransi', 'Kamena', 'Nyakanga', 'Kanama',
      'Nzeli', 'Ukwakira', 'Ugushyingo', 'Ukuboza'
    ]
  ],
  u, [['BCE', 'CE'], u, u], 1, [6, 0], ['y-MM-dd', 'y MMM d', 'y MMMM d', 'y MMMM d, EEEE'],
  ['HH:mm', 'HH:mm:ss', 'HH:mm:ss z', 'HH:mm:ss zzzz'], ['{1} {0}', u, u, u],
  [',', '.', ';', '%', '+', '-', 'E', '×', '‰', '∞', 'NaN', ':'],
  ['#,##0.###', '#,##0%', '¤ #,##0.00', '#E0'], 'RF', 'RWF',
  {'JPY': ['JP¥', '¥'], 'RWF': ['RF'], 'USD': ['US$', '$']}, plural
];
