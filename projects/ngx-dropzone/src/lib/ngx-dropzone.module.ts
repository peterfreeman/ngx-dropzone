import { NgModule } from '@angular/core';
import { NgxDropzoneComponent } from './ngx-dropzone.component';
import { CommonModule } from '@angular/common';
import { NgxDropzonePreviewComponent } from './ngx-dropzone-preview/ngx-dropzone-preview.component';
import { NgxDropzoneLabelComponent } from './ngx-dropzone-label/ngx-dropzone-label.component';
import { NgxDropzoneImagePreviewComponent } from './ngx-dropzone-image-preview/ngx-dropzone-image-preview.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NgxDropzoneComponent,
    NgxDropzonePreviewComponent,
    NgxDropzoneLabelComponent,
    NgxDropzoneImagePreviewComponent
  ],
  exports: [
    NgxDropzoneComponent
  ]
})
export class NgxDropzoneModule { }
