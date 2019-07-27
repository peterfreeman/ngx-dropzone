import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { coerceBooleanProperty } from '../helpers';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'ngx-dropzone-preview',
	template: `
		<ng-content select="ngx-dropzone-label"></ng-content>
		<ngx-dropzone-remove-badge *ngIf="removable" (click)="_remove($event)">
		</ngx-dropzone-remove-badge>
	`,
	styleUrls: ['./ngx-dropzone-preview.component.scss']
})
export class NgxDropzonePreviewComponent {

	constructor(
		protected sanitizer: DomSanitizer
	) { }

	/** The file to preview. */
	@Input() file: File;

	/** Allow the user to remove files. */
	@Input()
	get removable(): boolean {
		return this._removable;
	}
	set removable(value: boolean) {
		this._removable = coerceBooleanProperty(value);
	}
	protected _removable = false;

	/** Emitted when the element should be removed. */
	@Output() readonly removed = new EventEmitter<File>();

	/** We use the HostBinding to pass these common styles to child components. */
	@HostBinding('style')
	get hostStyle(): SafeStyle {
		const styles = `
			display: flex;
			height: 150px;
			min-height: 150px;
			min-width: 180px;
			max-width: 180px;
			justify-content: center;
			align-items: center;
			padding: 0 20px;
			border-radius: 5px;
			position: relative;
		`;

		return this.sanitizer.bypassSecurityTrustStyle(styles);
	}

	// TODO: add keyboard events

	/** Remove method to be used from the template. */
	_remove(event) {
		event.stopPropagation();
		this.remove();
	}

	/** Remove the preview item (use from component code). */
	remove() {
		this.removed.next(this.file);
	}

	protected async readFile(): Promise<string | ArrayBuffer> {
		return new Promise<string | ArrayBuffer>((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = e => {
				return resolve((e.target as FileReader).result);
			};

			reader.onerror = e => {
				console.error(`FileReader failed on file ${this.file.name}.`);
				return reject(null);
			};

			if (!this.file) {
				console.error('No file to read. Please provide a file using the component Input property.');
				return reject(null);
			}

			reader.readAsDataURL(this.file);
		});
	}
}
