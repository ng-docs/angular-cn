import {Component} from '@angular/core';

@Component({
  template: `
    <div style.width.px="a{{one}}b{{two}}c"></div>
  `
})
export class MyComponent {
  one = '';
  two = '';
}
