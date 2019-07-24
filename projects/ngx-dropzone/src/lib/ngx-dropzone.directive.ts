import { Directive, Output, EventEmitter, Input, HostListener, HostBinding, Self, ViewChild, OnInit } from '@angular/core';
import { coerceNumberProperty, coerceBooleanProperty } from './helpers';
import { NgxDropzoneService, FileSelectResult } from './ngx-dropzone.service';

@Directive({
	// tslint:disable-next-line:directive-selector
	selector: '[ngx-dropzone]',
	providers: [NgxDropzoneService]
})
export class NgxDropzoneDirective {
	constructor(
		@Self() public service: NgxDropzoneService
	) { }

	/** Emitted when any files were added or removed. */
	@Output() readonly filesChanged = new EventEmitter<File[]>();

	/** Emitted when any files were added. */
	@Output() readonly filesAdded = new EventEmitter<File[]>();

	/** Emitted when any files were rejected. */
	@Output() readonly filesRejected = new EventEmitter<File[]>();

	/** Emitted when any file was removed. */
	@Output() readonly fileRemoved = new EventEmitter<File>();

	/** Set the accepted file types. Defaults to '*'. */
	@Input() accept = '*';

	/** Disable any user interaction with the component. */
	@Input()
	@HostBinding('class.ngx-dz-disabled')
	get disabled(): boolean {
		return this._disabled;
	}
	set disabled(value: boolean) {
		this._disabled = coerceBooleanProperty(value);

		if (this._isHovered) {
			this._isHovered = false;
		}
	}
	protected _disabled = false;

	/** Allow the selection of multiple files. */
	@Input()
	get multiple(): boolean {
		return this._multiple;
	}
	set multiple(value: boolean) {
		this._multiple = coerceBooleanProperty(value);
	}
	protected _multiple = true;

	/** Set the maximum size a single file may have. */
	@Input()
	get maxFileSize(): number {
		return this._maxFileSize;
	}
	set maxFileSize(value: number) {
		this._maxFileSize = coerceNumberProperty(value);
	}
	protected _maxFileSize: number = undefined;

	@HostBinding('class.ngx-dz-hovered')
	_isHovered = false;

	@HostListener('dragover', ['$event'])
	_onDragOver(event) {
		if (this.disabled) {
			return;
		}

		this.preventDefault(event);
		this._isHovered = true;
	}

	@HostListener('dragleave')
	_onDragLeave() {
		this._isHovered = false;
	}

	@HostListener('drop', ['$event'])
	_onDrop(event) {
		if (this.disabled) {
			return;
		}

		this.preventDefault(event);
		this._isHovered = false;
		this.handleFileDrop(event.dataTransfer.files);
	}

	/** Show the native OS file explorer to select files. */
	@HostListener('click')
	showFileSelector() {
		if (!this.disabled) {
			// TODO: Is this okay with Angular?
			const fileInput = document.createElement('input');
			fileInput.setAttribute('type', 'file');
			fileInput.setAttribute('multiple', this.multiple.toString());
			fileInput.setAttribute('accept', this.accept);
			fileInput.addEventListener('change', ($event) => this._onFilesSelected($event, fileInput));
			fileInput.click();
		}
	}

	_onFilesSelected(event, fileInputElement: HTMLInputElement) {
		const files: FileList = event.target.files;

		this.handleFileDrop(files).then(() => {
			fileInputElement.remove();
		});
	}

	private async handleFileDrop(files: FileList): Promise<void> {
		return new Promise<void>(resolve => {
			this.service.parseFileList(files, this.accept, this.maxFileSize,
				this.multiple)
				.then((result: FileSelectResult) => {
					this.filesAdded.next(result.addedFiles);

					if (result.rejectedFiles.length) {
						this.filesRejected.next(result.rejectedFiles);
					}

					resolve();
				});
		});
	}

	private preventDefault(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
	}
}
