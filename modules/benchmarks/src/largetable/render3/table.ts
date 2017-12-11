/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {C, E, T, V, a, b, b1, c, defineComponent, detectChanges, e, rC, rc, t, v} from '@angular/core/src/render3/index';
import {ComponentDef} from '@angular/core/src/render3/public_interfaces';

import {TableCell, buildTable, emptyTable} from '../util';

export class LargeTableComponent {
  data: TableCell[][] = emptyTable;

  /** @nocollapse */
  static ngComponentDef: ComponentDef<LargeTableComponent> = defineComponent({
    type: LargeTableComponent,
    tag: 'largetable',
    template: function(ctx: LargeTableComponent, cm: boolean) {
      if (cm) {
        E(0, 'table');
        {
          E(1, 'tbody');
          {
            C(2);
            c();
          }
          e();
        }
        e();
      }
      rC(2);
      {
        for (let row of ctx.data) {
          let cm1 = V(1);
          {
            if (cm1) {
              E(0, 'tr');
              C(1);
              c();
              e();
            }
            rC(1);
            {
              for (let cell of row) {
                let cm2 = V(2);
                {
                  if (cm2) {
                    E(0, 'td');
                    { T(1); }
                    e();
                  }
                  a(0, 'style', b1('background-color:', cell.row % 2 ? '' : 'grey', ''));
                  t(1, b(cell.value));
                }
                v();
              }
            }
            rc();
          }
          v();
        }
      }
      rc();
    },
    factory: () => new LargeTableComponent(),
    inputs: {data: 'data'}
  });
}

export function destroyDom(component: LargeTableComponent) {
  component.data = emptyTable;
  detectChanges(component);
}

export function createDom(component: LargeTableComponent) {
  component.data = buildTable();
  detectChanges(component);
}
