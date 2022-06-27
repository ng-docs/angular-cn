import { Component, Input } from '@angular/core';
import { CurrentNode, NavigationNode } from 'app/navigation/navigation.service';

@Component({
  selector: 'aio-top-menu',
  styles: [`
    .nav-link.highlight {
      color: yellow;
    }
  `],
  template: `
    <nav aria-label="primary">
      <ul>
        <li *ngFor="let node of nodes" [ngClass]="{selected: node.url === currentUrl}">
          <a class="nav-link" [class.highlight]="node.highlight" [href]="node.url" [title]="node.tooltipCn ?? node.tooltip ?? node.titleCn ?? node.title"
           [target]="node.external?'_blank':'_self'">
            <span class="nav-link-inner">{{ node.titleCn ?? node.title }}</span>
          </a>
        </li>
      </ul>
    </nav>`,
})
export class TopMenuComponent {
  @Input() nodes: NavigationNode[];
  @Input() currentNode: CurrentNode | undefined;

  get currentUrl(): string | null { return this.currentNode ? this.currentNode.url : null; }
}
