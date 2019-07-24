import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDropzoneLabelDirective } from './ngx-dropzone-label.directive';
import { NgxDropzonePreviewComponent } from './ngx-dropzone-preview/ngx-dropzone-preview.component';
import { NgxDropzoneDirective } from './ngx-dropzone.directive';
import { NgxDropzoneContainerComponent } from './ngx-dropzone-container/ngx-dropzone-container.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		NgxDropzoneLabelDirective,
		NgxDropzonePreviewComponent,
		NgxDropzoneDirective,
		NgxDropzoneContainerComponent
	],
	exports: [
		NgxDropzoneLabelDirective,
		NgxDropzonePreviewComponent,
		NgxDropzoneDirective,
		NgxDropzoneContainerComponent
	]
})
export class NgxDropzoneModule { }
