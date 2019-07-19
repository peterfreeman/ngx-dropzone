import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneComponent } from './ngx-dropzone.component';
import { NgxDropzoneLabelDirective } from './ngx-dropzone-label.directive';
import { NgxDropzonePreviewComponent } from './ngx-dropzone-preview/ngx-dropzone-preview.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		NgxDropzoneComponent,
		NgxDropzoneLabelDirective,
		NgxDropzonePreviewComponent
	],
	exports: [
		NgxDropzoneComponent,
		NgxDropzoneLabelDirective,
		NgxDropzonePreviewComponent
	]
})
export class NgxDropzoneModule { }
