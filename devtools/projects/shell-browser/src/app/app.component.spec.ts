/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ApplicationOperations} from 'ng-devtools';

import {AppComponent} from './app.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    const applicationOperationsSPy = jasmine.createSpyObj('messageBus', ['viewSource']);
    TestBed
        .configureTestingModule({
          declarations: [AppComponent],
          imports: [RouterTestingModule],
          providers: [
            {
              provide: ApplicationOperations,
              useClass: applicationOperationsSPy,
            },
          ],
        })
        .compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
