/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';

interface Person {
  name: string;
}

@Component({
  selector: 'http-app',
  template: `
    <h1>people</h1>
    <ul class="people">
      <li *ngFor="let person of people">
        hello, {{person.name}}
      </li>
    </ul>
  `
})
export class HttpCmp {
  people: Person[];
  constructor(http: HttpClient) {
    http.get('./people.json').subscribe((people: Person[]) => this.people = people);
  }
}
