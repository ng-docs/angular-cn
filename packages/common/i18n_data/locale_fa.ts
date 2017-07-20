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
  'fa', [['ق', 'ب'], ['ق.ظ.', 'ب.ظ.'], ['قبل‌ازظهر', 'بعدازظهر']],
  [['ق.ظ.', 'ب.ظ.'], , ['قبل‌ازظهر', 'بعدازظهر']],
  [
    ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
    ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'], ,
    ['۱ش', '۲ش', '۳ش', '۴ش', '۵ش', 'ج', 'ش']
  ],
  ,
  [
    ['ژ', 'ف', 'م', 'آ', 'م', 'ژ', 'ژ', 'ا', 'س', 'ا', 'ن', 'د'],
    [
      'ژانویهٔ', 'فوریهٔ', 'مارس', 'آوریل', 'مهٔ', 'ژوئن', 'ژوئیهٔ', 'اوت', 'سپتامبر', 'اکتبر',
      'نوامبر', 'دسامبر'
    ],
  ],
  [
    ['ژ', 'ف', 'م', 'آ', 'م', 'ژ', 'ژ', 'ا', 'س', 'ا', 'ن', 'د'],
    [
      'ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر',
      'نوامبر', 'دسامبر'
    ],
  ],
  [['ق', 'م'], ['ق.م.', 'م.'], ['قبل از میلاد', 'میلادی']], 6, [5, 5],
  ['y/M/d', 'd MMM y', 'd MMMM y', 'EEEE d MMMM y'],
  ['H:mm', 'H:mm:ss', 'H:mm:ss (z)', 'H:mm:ss (zzzz)'],
  [
    '{1}،‏ {0}',
    ,
    '{1}، ساعت {0}',
  ],
  ['.', ',', ';', '%', '‎+', '‎−', 'E', '×', '‰', '∞', 'ناعدد', ':'],
  ['#,##0.###', '#,##0%', '‎¤ #,##0.00', '#E0'], 'ریال', 'ریال ایران',
  function(n: number):
      Plural {
        let i = Math.floor(Math.abs(n));
        if (i === 0 || n === 1) return Plural.One;
        return Plural.Other;
      }
];
