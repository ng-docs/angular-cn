import {Component, NgModule} from '@angular/core';

@Component({selector: 'my-component', template: `<div [style.font-size.px]="12"></div>`})
export class MyComponent {
}

@NgModule({declarations: [MyComponent]})
export class MyModule {
}
