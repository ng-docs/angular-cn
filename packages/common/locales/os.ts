/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// THIS CODE IS GENERATED - DO NOT MODIFY
// See angular/tools/gulp-tasks/cldr/extract.js

function plural(n: number): number {
  if (n === 1) return 1;
  return 5;
}

export default [
  'os', [['AM', 'PM'], , ['ӕмбисбоны размӕ', 'ӕмбисбоны фӕстӕ']],
  [
    ['AM', 'PM'],
    ,
  ],
  [
    ['Х', 'К', 'Д', 'Ӕ', 'Ц', 'М', 'С'],
    ['хцб', 'крс', 'дцг', 'ӕрт', 'цпр', 'мрб', 'сбт'],
    [
      'хуыцаубон', 'къуырисӕр', 'дыццӕг', 'ӕртыццӕг',
      'цыппӕрӕм', 'майрӕмбон', 'сабат'
    ],
    ['хцб', 'крс', 'дцг', 'ӕрт', 'цпр', 'мрб', 'сбт']
  ],
  [
    ['Х', 'К', 'Д', 'Ӕ', 'Ц', 'М', 'С'],
    ['Хцб', 'Крс', 'Дцг', 'Ӕрт', 'Цпр', 'Мрб', 'Сбт'],
    [
      'Хуыцаубон', 'Къуырисӕр', 'Дыццӕг', 'Ӕртыццӕг',
      'Цыппӕрӕм', 'Майрӕмбон', 'Сабат'
    ],
    ['хцб', 'крс', 'дцг', 'ӕрт', 'цпр', 'мрб', 'сбт']
  ],
  [
    ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'],
    [
      'янв.', 'фев.', 'мар.', 'апр.', 'майы', 'июны', 'июлы', 'авг.',
      'сен.', 'окт.', 'ноя.', 'дек.'
    ],
    [
      'январы', 'февралы', 'мартъийы', 'апрелы', 'майы', 'июны',
      'июлы', 'августы', 'сентябры', 'октябры', 'ноябры',
      'декабры'
    ]
  ],
  [
    ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'],
    [
      'Янв.', 'Февр.', 'Март.', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.',
      'Сент.', 'Окт.', 'Нояб.', 'Дек.'
    ],
    [
      'Январь', 'Февраль', 'Мартъи', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь',
      'Декабрь'
    ]
  ],
  [
    ['н.д.а.', 'н.д.'],
    ,
  ],
  1, [6, 0], ['dd.MM.yy', 'dd MMM y \'аз\'', 'd MMMM, y \'аз\'', 'EEEE, d MMMM, y \'аз\''],
  ['HH:mm', 'HH:mm:ss', 'HH:mm:ss z', 'HH:mm:ss zzzz'],
  [
    '{1}, {0}',
    ,
    ,
  ],
  [',', ' ', ';', '%', '+', '-', 'E', '×', '‰', '∞', 'НН', ':'],
  ['#,##0.###', '#,##0%', '¤ #,##0.00', '#E0'], '₾', 'Лар', plural
];
