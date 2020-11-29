import {Component, NgModule} from '@angular/core';

@Component(
    {selector: 'my-component', animations: [{name: 'foo123'}, {name: 'trigger123'}], template: ''})
export class MyComponent {
}

@NgModule({declarations: [MyComponent]})
export class MyModule {
}
