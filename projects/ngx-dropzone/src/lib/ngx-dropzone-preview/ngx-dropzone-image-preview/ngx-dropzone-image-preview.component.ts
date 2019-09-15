import { Component, OnInit, HostBinding } from '@angular/core';
import { NgxDropzonePreviewComponent } from '../ngx-dropzone-preview.component';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'ngx-dropzone-image-preview',
  template: `
    <img [src]="imageSrc" />
		<ng-content select="ngx-dropzone-label"></ng-content>
    <ngx-dropzone-remove-badge *ngIf="removable" (click)="_remove($event)">
    </ngx-dropzone-remove-badge>
	`,
  styleUrls: ['./ngx-dropzone-image-preview.component.scss'],
  providers: [
    {
      provide: NgxDropzonePreviewComponent,
      useExisting: NgxDropzoneImagePreviewComponent
    }
  ]
})
export class NgxDropzoneImagePreviewComponent extends NgxDropzonePreviewComponent implements OnInit {

  constructor(
    sanitizer: DomSanitizer
  ) {
    super(sanitizer);
  }

  /** The image data source. */
  imageSrc: string | ArrayBuffer = '';

  ngOnInit() {
    this.readFile()
      .then(img => setTimeout(() => this.imageSrc = img))
      .catch(err => console.error(err));
  }
}
