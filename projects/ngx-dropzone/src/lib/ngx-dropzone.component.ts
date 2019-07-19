import
{
	Component,
	Input, Output, ElementRef, ViewChild,
	AfterViewInit, EventEmitter, TemplateRef,
	ViewEncapsulation,
	HostListener,
	HostBinding,
	Self,
	ContentChildren,
	QueryList
} from '@angular/core';
import { NgxDropzoneService, FilePreview, FileSelectResult } from './ngx-dropzone.service';
import { NgxDropzonePreviewComponent } from './ngx-dropzone-preview/ngx-dropzone-preview.component';
import { coerceNumberProperty, coerceBooleanProperty } from './helpers';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'ngx-dropzone, [ngx-dropzone]',
	templateUrl: './ngx-dropzone.component.html',
	styleUrls: ['./ngx-dropzone.component.scss'],
	providers: [NgxDropzoneService]
})
export class NgxDropzoneComponent
{
	constructor(
		@Self() public service: NgxDropzoneService
	) { }

	/** A reference to the native file input element to show the OS file selector. */
	@ViewChild('fileInput') protected fileInput: ElementRef;

	/** A list of the content-projected preview children. */
	@ContentChildren(NgxDropzonePreviewComponent) _previewChildren: QueryList<NgxDropzonePreviewComponent>;

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
	@HostBinding('class.disabled')
	get disabled(): boolean
	{
		return this._disabled;
	}
	set disabled(value: boolean)
	{
		this._disabled = coerceBooleanProperty(value);

		if (this._isHovered)
		{
			this._isHovered = false;
		}
	}
	protected _disabled = false;

	/** Allow the selection of multiple files. */
	@Input()
	get multiple(): boolean
	{
		return this._multiple;
	}
	set multiple(value: boolean)
	{
		this._multiple = coerceBooleanProperty(value);
	}
	protected _multiple = true;

	/** Set the maximum size a single file may have. */
	@Input()
	get maxFileSize(): number
	{
		return this._maxFileSize;
	}
	set maxFileSize(value: number)
	{
		this._maxFileSize = coerceNumberProperty(value);
	}
	protected _maxFileSize: number = undefined;

	@HostBinding('class.hovered')
	_isHovered = false;

	@HostListener('dragover', ['$event'])
	_onDragOver(event)
	{
		if (this.disabled)
		{
			return;
		}

		this.preventDefault(event);
		this._isHovered = true;
	}

	@HostListener('dragleave')
	_onDragLeave()
	{
		this._isHovered = false;
	}

	@HostListener('drop', ['$event'])
	_onDrop(event)
	{
		if (this.disabled)
		{
			return;
		}

		this.preventDefault(event);
		this._isHovered = false;
		this.handleFileDrop(event.dataTransfer.files);
	}

	/** Show the native OS file explorer to select files. */
	@HostListener('click')
	showFileSelector()
	{
		if (!this.disabled)
		{
			this.fileInput.nativeElement.click();
		}
	}

	get _hasPreviews(): boolean
	{
		return !!this._previewChildren.length;
	}

	_onFilesSelected(event)
	{
		const files: FileList = event.target.files;

		this.handleFileDrop(files).then(() =>
		{
			// Reset the file input value to trigger the event on new selection.
			(this.fileInput.nativeElement as HTMLInputElement).value = '';
		});
	}

	private async handleFileDrop(files: FileList): Promise<void>
	{
		return new Promise<void>(resolve =>
		{
			this.service.parseFileList(files, this.accept, this.maxFileSize,
				this.multiple)
				.then((result: FileSelectResult) =>
				{
					this.filesAdded.next(result.addedFiles);

					if (result.rejectedFiles.length)
					{
						this.filesRejected.next(result.rejectedFiles);
					}

					resolve();
				});
		});
	}

	private preventDefault(event: DragEvent)
	{
		event.preventDefault();
		event.stopPropagation();
	}
}
