/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

describe('RouterLink', () => {
  it('does not modify tabindex if already set on non-anchor element', () => {
    @Component({template: `<div [routerLink]="link" tabindex="1"></div>`})
    class LinkComponent {
      link: string|null|undefined = '/';
    }
    TestBed.configureTestingModule({imports: [RouterTestingModule], declarations: [LinkComponent]});
    const fixture = TestBed.createComponent(LinkComponent);
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(link.tabIndex).toEqual(1);

    fixture.nativeElement.link = null;
    fixture.detectChanges();
    expect(link.tabIndex).toEqual(1);
  });

  describe('on a non-anchor', () => {
    @Component({template: `<div [routerLink]="link"></div>`})
    class LinkComponent {
      link: string|null|undefined = '/';
    }
    let fixture: ComponentFixture<LinkComponent>;
    let link: HTMLDivElement;
    let router: Router;

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [RouterTestingModule], declarations: [LinkComponent]});
      fixture = TestBed.createComponent(LinkComponent);
      fixture.detectChanges();
      link = fixture.debugElement.query(By.css('div')).nativeElement;
      router = TestBed.inject(Router);

      spyOn(router, 'navigateByUrl');
      link.click();
      expect(router.navigateByUrl).toHaveBeenCalled();
      (router.navigateByUrl as jasmine.Spy).calls.reset();
    });

    it('null, removes tabIndex and does not navigate', () => {
      fixture.componentInstance.link = null;
      fixture.detectChanges();
      expect(link.tabIndex).toEqual(-1);

      link.click();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });

    it('undefined, removes tabIndex and does not navigate', () => {
      fixture.componentInstance.link = undefined;
      fixture.detectChanges();
      expect(link.tabIndex).toEqual(-1);

      link.click();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('RouterLinkWithHref', () => {
    @Component({template: `<a [routerLink]="link"></a>`})
    class LinkComponent {
      link: string|null|undefined = '/';
    }
    let fixture: ComponentFixture<LinkComponent>;
    let link: HTMLAnchorElement;

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [RouterTestingModule], declarations: [LinkComponent]});
      fixture = TestBed.createComponent(LinkComponent);
      fixture.detectChanges();
      link = fixture.debugElement.query(By.css('a')).nativeElement;
    });

    it('null, removes href', () => {
      expect(link.outerHTML).toContain('href');
      fixture.componentInstance.link = null;
      fixture.detectChanges();
      expect(link.outerHTML).not.toContain('href');
    });

    it('undefined, removes href', () => {
      expect(link.outerHTML).toContain('href');
      fixture.componentInstance.link = undefined;
      fixture.detectChanges();
      expect(link.outerHTML).not.toContain('href');
    });
  });
});
