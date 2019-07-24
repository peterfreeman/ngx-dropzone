import { Component, ContentChildren, QueryList } from '@angular/core';
import { NgxDropzonePreviewComponent } from '../ngx-dropzone-preview/ngx-dropzone-preview.component';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'ngx-dropzone-container',
	templateUrl: './ngx-dropzone-container.component.html',
	styleUrls: ['./ngx-dropzone-container.component.scss']
})
export class NgxDropzoneContainerComponent
{
	/** A list of the content-projected preview children. */
	@ContentChildren(NgxDropzonePreviewComponent) _previewChildren: QueryList<NgxDropzonePreviewComponent>;

	get _hasPreviews(): boolean
	{
		return !!this._previewChildren.length;
	}
}
