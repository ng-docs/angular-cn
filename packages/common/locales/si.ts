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
  let i = Math.floor(Math.abs(n)), f = parseInt(n.toString().replace(/^[^.]*\.?/, ''), 10) || 0;
  if (n === 0 || n === 1 || i === 0 && f === 1) return 1;
  return 5;
}

export default [
  'si',
  [['පෙ', 'ප'], ['පෙ.ව.', 'ප.ව.'], u],
  [['පෙ.ව.', 'ප.ව.'], u, u],
  [
    ['ඉ', 'ස', 'අ', 'බ', 'බ්\u200dර', 'සි', 'සෙ'],
    [
      'ඉරිදා', 'සඳුදා', 'අඟහ', 'බදාදා',
      'බ්\u200dරහස්', 'සිකු', 'සෙන'
    ],
    [
      'ඉරිදා', 'සඳුදා', 'අඟහරුවාදා', 'බදාදා',
      'බ්\u200dරහස්පතින්දා', 'සිකුරාදා',
      'සෙනසුරාදා'
    ],
    [
      'ඉරි', 'සඳු', 'අඟ', 'බදා', 'බ්\u200dරහ', 'සිකු',
      'සෙන'
    ]
  ],
  u,
  [
    [
      'ජ', 'පෙ', 'මා', 'අ', 'මැ', 'ජූ', 'ජූ', 'අ', 'සැ', 'ඔ',
      'නෙ', 'දෙ'
    ],
    [
      'ජන', 'පෙබ', 'මාර්තු', 'අප්\u200dරේල්', 'මැයි',
      'ජූනි', 'ජූලි', 'අගෝ', 'සැප්', 'ඔක්', 'නොවැ',
      'දෙසැ'
    ],
    [
      'ජනවාරි', 'පෙබරවාරි', 'මාර්තු',
      'අප්\u200dරේල්', 'මැයි', 'ජූනි', 'ජූලි',
      'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්',
      'නොවැම්බර්', 'දෙසැම්බර්'
    ]
  ],
  [
    [
      'ජ', 'පෙ', 'මා', 'අ', 'මැ', 'ජූ', 'ජූ', 'අ', 'සැ', 'ඔ',
      'නෙ', 'දෙ'
    ],
    [
      'ජන', 'පෙබ', 'මාර්', 'අප්\u200dරේල්', 'මැයි',
      'ජූනි', 'ජූලි', 'අගෝ', 'සැප්', 'ඔක්', 'නොවැ',
      'දෙසැ'
    ],
    [
      'ජනවාරි', 'පෙබරවාරි', 'මාර්තු',
      'අප්\u200dරේල්', 'මැයි', 'ජූනි', 'ජූලි',
      'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්',
      'නොවැම්බර්', 'දෙසැම්බර්'
    ]
  ],
  [
    ['ක්\u200dරි.පූ.', 'ක්\u200dරි.ව.'], u,
    [
      'ක්\u200dරිස්තු පූර්ව',
      'ක්\u200dරිස්තු වර්ෂ'
    ]
  ],
  1,
  [6, 0],
  ['y-MM-dd', 'y MMM d', 'y MMMM d', 'y MMMM d, EEEE'],
  ['HH.mm', 'HH.mm.ss', 'HH.mm.ss z', 'HH.mm.ss zzzz'],
  ['{1} {0}', u, u, u],
  ['.', ',', ';', '%', '+', '-', 'E', '×', '‰', '∞', 'NaN', '.'],
  ['#,##0.###', '#,##0%', '¤#,##0.00', '#'],
  'රු.',
  'ශ්\u200dරී ලංකා රුපියල',
  {
    'JPY': ['JP¥', '¥'],
    'LKR': ['රු.'],
    'THB': ['฿'],
    'TWD': ['NT$'],
    'USD': ['US$', '$'],
    'XOF': ['සිෆ්එ']
  },
  'ltr',
  plural
];
