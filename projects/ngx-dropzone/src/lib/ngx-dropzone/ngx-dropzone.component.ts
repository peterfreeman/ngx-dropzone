import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ContentChildren, QueryList, HostBinding, HostListener, Self, ElementRef } from '@angular/core';
import { NgxDropzoneService, FileSelectResult } from '../ngx-dropzone.service';
import { coerceBooleanProperty, coerceNumberProperty } from '../helpers';
import { NgxDropzonePreviewComponent } from '../ngx-dropzone-preview/ngx-dropzone-preview.component';

export interface NgxDropzoneChangeEvent {
  source: NgxDropzoneComponent;
  addedFiles: File[];
  rejectedFiles: File[];
}

@Component({
  selector: 'ngx-dropzone, [ngx-dropzone]',
  templateUrl: './ngx-dropzone.component.html',
  styleUrls: ['./ngx-dropzone.component.scss'],
  providers: [NgxDropzoneService]
})
export class NgxDropzoneComponent {

  constructor(
    @Self() private service: NgxDropzoneService
  ) { }

  /** A list of the content-projected preview children. */
  @ContentChildren(NgxDropzonePreviewComponent, { descendants: true })
  _previewChildren: QueryList<NgxDropzonePreviewComponent>;

  get _hasPreviews(): boolean {
    return !!this._previewChildren.length;
  }

  /** A template reference to the native file input element. */
  @ViewChild('fileInput') _fileInput: ElementRef;

  /** Emitted when any files were added or rejected. */
  @Output() readonly change = new EventEmitter<NgxDropzoneChangeEvent>();

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
  private _disabled = false;

  /** Allow the selection of multiple files. */
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this._multiple = coerceBooleanProperty(value);
  }
  private _multiple = true;

  /** Set the maximum size a single file may have. */
  @Input()
  get maxFileSize(): number {
    return this._maxFileSize;
  }
  set maxFileSize(value: number) {
    this._maxFileSize = coerceNumberProperty(value);
  }
  private _maxFileSize: number = undefined;

  /** Allow the dropzone container to expand vertically. */
  @Input()
  @HostBinding('class.expandable')
  get expandable(): boolean {
    return this._expandable;
  }
  set expandable(value: boolean) {
    this._expandable = coerceBooleanProperty(value);
  }
  private _expandable: boolean = false;

  @HostBinding('class.ngx-dz-hovered')
  _isHovered = false;

  /** Show the native OS file explorer to select files. */
  @HostListener('click')
  showFileSelector() {
    if (!this.disabled) {
      (this._fileInput.nativeElement as HTMLInputElement).click();
    }
  }

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

  _onFilesSelected(event) {
    const files: FileList = event.target.files;
    this.handleFileDrop(files);
  }

  private handleFileDrop(files: FileList) {
    const result: FileSelectResult =
      this.service.parseFileList(files, this.accept, this.maxFileSize, this.multiple);

    this.change.next({
      addedFiles: result.addedFiles,
      rejectedFiles: result.rejectedFiles,
      source: this
    });
  }

  private preventDefault(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
