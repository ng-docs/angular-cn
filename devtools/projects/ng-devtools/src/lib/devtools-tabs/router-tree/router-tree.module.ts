import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';

import {RouterTreeComponent} from './router-tree.component';

@NgModule({
  declarations: [RouterTreeComponent],
  imports: [CommonModule, MatDialogModule, MatSelectModule],
  exports: [RouterTreeComponent],
  entryComponents: [],
})
export class RouterTreeModule {
}
