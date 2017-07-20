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
  'ru-MD',
  [
    ['ДП', 'ПП'],
    ,
  ],
  ,
  [
    ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'], ,
    ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
  ],
  [
    ['В', 'П', 'В', 'С', 'Ч', 'П', 'С'], ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
    ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
  ],
  [
    ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'],
    [
      'янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.',
      'дек.'
    ],
    [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября',
      'октября', 'ноября', 'декабря'
    ]
  ],
  [
    ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'],
    [
      'янв.', 'февр.', 'март', 'апр.', 'май', 'июнь', 'июль', 'авг.', 'сент.', 'окт.', 'нояб.',
      'дек.'
    ],
    [
      'январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь',
      'ноябрь', 'декабрь'
    ]
  ],
  [['до н.э.', 'н.э.'], ['до н. э.', 'н. э.'], ['до Рождества Христова', 'от Рождества Христова']],
  1, [6, 0], ['dd.MM.y', 'd MMM y \'г\'.', 'd MMMM y \'г\'.', 'EEEE, d MMMM y \'г\'.'],
  ['H:mm', 'H:mm:ss', 'H:mm:ss z', 'H:mm:ss zzzz'],
  [
    '{1}, {0}',
    ,
    ,
  ],
  [',', ' ', ';', '%', '+', '-', 'E', '×', '‰', '∞', 'не число', ':'],
  ['#,##0.###', '#,##0 %', '#,##0.00 ¤', '#E0'], 'L', 'Молдавский лей',
  function(n: number):
      Plural {
        let i = Math.floor(Math.abs(n)), v = n.toString().replace(/^[^.]*\.?/, '').length;
        if (v === 0 && i % 10 === 1 && !(i % 100 === 11)) return Plural.One;
        if (v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 2 && i % 10 <= 4 &&
            !(i % 100 >= 12 && i % 100 <= 14))
          return Plural.Few;
        if (v === 0 && i % 10 === 0 ||
            v === 0 && i % 10 === Math.floor(i % 10) && i % 10 >= 5 && i % 10 <= 9 ||
            v === 0 && i % 100 === Math.floor(i % 100) && i % 100 >= 11 && i % 100 <= 14)
          return Plural.Many;
        return Plural.Other;
      }
];
