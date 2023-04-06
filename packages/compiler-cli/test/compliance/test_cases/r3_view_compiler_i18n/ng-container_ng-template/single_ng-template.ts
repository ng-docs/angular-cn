import {Component, NgModule} from '@angular/core';

@Component({
  selector: 'my-component',
  template: `
  <ng-template i18n>Some content: {{ valueA | uppercase }}</ng-template>
`,
})
export class MyComponent {
}

@NgModule({declarations: [MyComponent]})
export class MyModule {
}
