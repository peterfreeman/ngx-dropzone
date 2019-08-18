import { Component } from '@angular/core';

@Component({
  selector: 'ngx-dropzone-remove-badge',
  template: `
    <svg>
      <line x1="0" y1="0" x2="10" y2="10" />
      <line x1="0" y1="10" x2="10" y2="0" />
    </svg>
  `,
  styleUrls: ['./ngx-dropzone-remove-badge.component.scss']
})
export class NgxDropzoneRemoveBadgeComponent { }
