/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// THIS CODE IS GENERATED - DO NOT MODIFY
// See angular/tools/gulp-tasks/cldr/extract.js

import {Plural} from '@angular/common';

export default [
  'ar-DZ',
  [
    ['ص', 'م'],
    ,
  ],
  [['ص', 'م'], , ['صباحًا', 'مساءً']],
  [
    ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
    ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    ,
  ],
  ,
  [
    ['ج', 'ف', 'م', 'أ', 'م', 'ج', 'ج', 'أ', 'س', 'أ', 'ن', 'د'],
    [
      'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر',
      'نوفمبر', 'ديسمبر'
    ],
  ],
  , [['ق.م', 'م'], , ['قبل الميلاد', 'ميلادي']], 6, [5, 6],
  ['d‏/M‏/y', 'dd‏/MM‏/y', 'd MMMM، y', 'EEEE، d MMMM، y'],
  ['h:mm a', 'h:mm:ss a', 'h:mm:ss a z', 'h:mm:ss a zzzz'],
  [
    '{1} {0}',
    ,
    ,
  ],
  [',', '.', ';', '‎%‎', '‎+', '‎-', 'E', '×', '‰', '∞', 'ليس رقمًا', ':'],
  ['#,##0.###', '#,##0%', '¤ #,##0.00', '#E0'], 'د.ج.‏', 'دينار جزائري',
  function(n: number):
      Plural {
        if (n === 0) return Plural.Zero;
        if (n === 1) return Plural.One;
        if (n === 2) return Plural.Two;
        if (n % 100 === Math.floor(n % 100) && n % 100 >= 3 && n % 100 <= 10) return Plural.Few;
        if (n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 99) return Plural.Many;
        return Plural.Other;
      }
];
