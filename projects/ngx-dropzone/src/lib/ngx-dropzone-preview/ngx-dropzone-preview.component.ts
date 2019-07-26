import { Component, Input, Output, EventEmitter } from '@angular/core';
import { coerceBooleanProperty } from '../helpers';

@Component({
	selector: 'ngx-dropzone-preview',
	template: `
		<ng-content select="ngx-dropzone-label"></ng-content>
		<div class="badge" *ngIf="removable" (click)="_remove($event)">
			<svg>
				<line x1="0" y1="0" x2="10" y2="10" />
				<line x1="0" y1="10" x2="10" y2="0" />
			</svg>
		</div>
	`,
	styleUrls: ['./ngx-dropzone-preview.component.scss']
})
export class NgxDropzonePreviewComponent {

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

	@Output() readonly removed = new EventEmitter<File>();

	// TODO: add keyboard events

	_remove(event) {
		event.stopPropagation();
		this.remove();
	}

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

			reader.readAsDataURL(this.file);
		});
	}
}
