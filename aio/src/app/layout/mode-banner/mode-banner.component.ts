import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { VersionInfo } from 'app/navigation/navigation.service';

@Component({
  selector: 'aio-mode-banner',
  template: `
    <div *ngIf="mode === 'archive'" class="mode-banner alert archive-warning">
      <p>
        这是 <strong>Angular v{{ version.major }} 的存档版本。</strong>请访问 <a href="https://angular.cn{{currentPath}}?redirected_from={{version.major}}">angular.cn</a> 以查看 Angular 当前版本中的本页面。
      </p>
    </div>
  `,
})
export class ModeBannerComponent {
  @Input() mode: string;
  @Input() version: VersionInfo;

  currentPath: string;

  constructor(private location: Location) {
    this.currentPath = this.location.path();
  }
}
