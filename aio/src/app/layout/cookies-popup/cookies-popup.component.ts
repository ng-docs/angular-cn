import { Component, Inject } from '@angular/core';
import { LocalStorage } from 'app/shared/storage.service';

export const storageKey = 'aio-accepts-cookies';

@Component({
  selector: 'aio-cookies-popup',
  template: `
    <div class="cookies-popup no-print" *ngIf="!hasAcceptedCookies">
      <h2 class="visually-hidden" translation-result="on">Cookie 使用提醒</h2>
      <h2 class="visually-hidden" translation-origin="off">Cookies concent notice</h2>

      <p translation-result="on" style="color: inherit">本站使用来自 Google 的 Cookie 来提供服务并分析使用行为。</p>
      <p translation-origin="off" style="color: inherit">This site uses cookies from Google to deliver its services and to analyze traffic.</p>

      <div class="actions">
        <a mat-button href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener">
          了解更多
        </a>
        <button mat-button (click)="acceptCookies()">
          好，知道了
        </button>
      </div>
    </div>
  `,
})
export class CookiesPopupComponent {
  /** Whether the user has already accepted the cookies disclaimer. */
  hasAcceptedCookies: boolean;

  constructor(@Inject(LocalStorage) private storage: Storage) {
    this.hasAcceptedCookies = this.storage.getItem(storageKey) === 'true';
  }

  acceptCookies() {
    this.storage.setItem(storageKey, 'true');
    this.hasAcceptedCookies = true;
  }
}
