import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneLabelDirective } from './ngx-dropzone-label.directive';
import { NgxDropzonePreviewComponent } from './ngx-dropzone-preview/ngx-dropzone-preview.component';
import { NgxDropzoneComponent } from './ngx-dropzone/ngx-dropzone.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		NgxDropzoneComponent,
		NgxDropzoneLabelDirective,
		NgxDropzonePreviewComponent,
	],
	exports: [
		NgxDropzoneComponent,
		NgxDropzoneLabelDirective,
		NgxDropzonePreviewComponent,
	]
})
export class NgxDropzoneModule { }
