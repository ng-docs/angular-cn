import {Component, NgModule} from '@angular/core';

@Component({selector: 'my-app', template: `<div>My App</div>`})
export class MyApp {
}

@Component({selector: 'my-component', template: `<my-app (click)="onClick($event);"></my-app>`})
export class MyComponent {
  onClick(event: any) {}
}

@NgModule({declarations: [MyComponent]})
export class MyModule {
}
