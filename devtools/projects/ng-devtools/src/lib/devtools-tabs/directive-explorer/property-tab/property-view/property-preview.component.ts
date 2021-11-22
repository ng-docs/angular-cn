import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PropType } from 'protocol';
import { FlatNode } from '../../property-resolver/element-property-resolver';

@Component({
  selector: 'ng-property-preview',
  templateUrl: './property-preview.component.html',
  styleUrls: ['./property-preview.component.scss'],
})
export class PropertyPreviewComponent {
  @Input() node: FlatNode;
  @Output() inspect = new EventEmitter<void>();

  get isClickableProp(): boolean {
    return this.node.prop.descriptor.type === PropType.Function || this.node.prop.descriptor.type === PropType.HTMLNode;
  }
}
