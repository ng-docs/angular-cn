// #docplaster
import { fakeAsync, ComponentFixture, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { asyncData, asyncError } from '../../testing';

import { of, throwError } from 'rxjs';
import { last } from 'rxjs/operators';

import { TwainComponent } from './twain.component';
import { TwainService } from './twain.service';

describe('TwainComponent', () => {
  let component: TwainComponent;
  let fixture: ComponentFixture<TwainComponent>;
  let getQuoteSpy: jasmine.Spy;
  let quoteEl: HTMLElement;
  let testQuote: string;

  // Helper function to get the error message element value
  // An *ngIf keeps it out of the DOM until there is an error
  const errorMessage = () => {
    const el = fixture.nativeElement.querySelector('.error');
    return el ? el.textContent : null;
  };

  // #docregion setup
  beforeEach(() => {
    testQuote = 'Test Quote';

    // #docregion spy
    // Create a fake TwainService object with a `getQuote()` spy
    const twainService = jasmine.createSpyObj('TwainService', ['getQuote']);
    // Make the spy return a synchronous Observable with the test data
    getQuoteSpy = twainService.getQuote.and.returnValue(of(testQuote));
    // #enddocregion spy

    TestBed.configureTestingModule({
      declarations: [TwainComponent],
      providers: [{provide: TwainService, useValue: twainService}]
    });

    fixture = TestBed.createComponent(TwainComponent);
    component = fixture.componentInstance;
    quoteEl = fixture.nativeElement.querySelector('.twain');
  });
  // #enddocregion setup

  describe('when test with synchronous observable', () => {
    it('should not show quote before OnInit', () => {
      expect(quoteEl.textContent)
        .withContext('nothing displayed')
        .toBe('');
      expect(errorMessage())
        .withContext('should not show error element')
        .toBeNull();
      expect(getQuoteSpy.calls.any())
        .withContext('getQuote not yet called')
        .toBe(false);
    });

    // The quote would not be immediately available if the service were truly async.
    // #docregion sync-test
    it('should show quote after component initialized', () => {
      fixture.detectChanges();  // onInit()

      // sync spy result shows testQuote immediately after init
      expect(quoteEl.textContent).toBe(testQuote);
      expect(getQuoteSpy.calls.any())
        .withContext('getQuote called')
        .toBe(true);
    });
    // #enddocregion sync-test


    // The error would not be immediately available if the service were truly async.
    // Use `fakeAsync` because the component error calls `setTimeout`
    // #docregion error-test
    it('should display error when TwainService fails', fakeAsync(() => {
         // tell spy to return an error observable
         getQuoteSpy.and.returnValue(throwError(() => new Error('TwainService test failure')));
         fixture.detectChanges();  // onInit()
         // sync spy errors immediately after init

         tick();  // flush the component's setTimeout()

         fixture.detectChanges();  // update errorMessage within setTimeout()

         expect(errorMessage())
          .withContext('should display error')
          .toMatch(/test failure/, );
         expect(quoteEl.textContent)
          .withContext('should show placeholder')
          .toBe('...');
       }));
    // #enddocregion error-test
  });

  describe('when test with asynchronous observable', () => {
    beforeEach(() => {
      // #docregion async-setup
      // Simulate delayed observable values with the `asyncData()` helper
      getQuoteSpy.and.returnValue(asyncData(testQuote));
      // #enddocregion async-setup
    });

    it('should not show quote before OnInit', () => {
      expect(quoteEl.textContent)
        .withContext('nothing displayed')
        .toBe('');
      expect(errorMessage())
        .withContext('should not show error element')
        .toBeNull();
      expect(getQuoteSpy.calls.any())
        .withContext('getQuote not yet called')
        .toBe(false);
    });

    it('should still not show quote after component initialized', () => {
      fixture.detectChanges();
      // getQuote service is async => still has not returned with quote
      // so should show the start value, '...'
      expect(quoteEl.textContent)
        .withContext('should show placeholder')
        .toBe('...');
      expect(errorMessage())
        .withContext('should not show error')
        .toBeNull();
      expect(getQuoteSpy.calls.any())
        .withContext('getQuote called')
        .toBe(true);
    });

    // #docregion fake-async-test
    it('should show quote after getQuote (fakeAsync)', fakeAsync(() => {
         fixture.detectChanges();  // ngOnInit()
         expect(quoteEl.textContent)
          .withContext('should show placeholder')
          .toBe('...');

         tick();                   // flush the observable to get the quote
         fixture.detectChanges();  // update view

         expect(quoteEl.textContent)
          .withContext('should show quote')
          .toBe(testQuote);
         expect(errorMessage())
          .withContext('should not show error')
          .toBeNull();
       }));
    // #enddocregion fake-async-test

    // #docregion waitForAsync-test
    it('should show quote after getQuote (waitForAsync)', waitForAsync(() => {
         fixture.detectChanges();  // ngOnInit()
         expect(quoteEl.textContent)
          .withContext('should show placeholder')
          .toBe('...');

         fixture.whenStable().then(() => {  // wait for async getQuote
           fixture.detectChanges();         // update view with quote
           expect(quoteEl.textContent).toBe(testQuote);
           expect(errorMessage())
            .withContext('should not show error')
            .toBeNull();
         });
       }));
    // #enddocregion waitForAsync-test


    // #docregion quote-done-test
    it('should show last quote (quote done)', (done: DoneFn) => {
      fixture.detectChanges();

      component.quote.pipe(last()).subscribe(() => {
        fixture.detectChanges();  // update view with quote
        expect(quoteEl.textContent).toBe(testQuote);
        expect(errorMessage())
          .withContext('should not show error')
          .toBeNull();
        done();
      });
    });
    // #enddocregion quote-done-test

    // #docregion spy-done-test
    it('should show quote after getQuote (spy done)', (done: DoneFn) => {
      fixture.detectChanges();

      // the spy's most recent call returns the observable with the test quote
      getQuoteSpy.calls.mostRecent().returnValue.subscribe(() => {
        fixture.detectChanges();  // update view with quote
        expect(quoteEl.textContent).toBe(testQuote);
        expect(errorMessage())
          .withContext('should not show error')
          .toBeNull();
        done();
      });
    });
    // #enddocregion spy-done-test

    it('should display error when TwainService fails', fakeAsync(() => {
         // tell spy to return an async error observable
         getQuoteSpy.and.returnValue(asyncError<string>('TwainService test failure'));

         fixture.detectChanges();
         tick();                   // component shows error after a setTimeout()
         fixture.detectChanges();  // update error message

         expect(errorMessage())
          .withContext('should display error')
          .toMatch(/test failure/);
         expect(quoteEl.textContent)
          .withContext('should show placeholder')
          .toBe('...');
       }));
  });
});
