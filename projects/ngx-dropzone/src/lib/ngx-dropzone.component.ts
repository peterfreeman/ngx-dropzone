import {
  Component,
  Input, Output, ElementRef, ViewChild,
  AfterViewInit, EventEmitter, TemplateRef,
  ViewEncapsulation,
  HostListener,
  HostBinding
} from '@angular/core';
import { NgxDropzoneService, FilePreview, FileSelectResult } from './ngx-dropzone.service';
import { resolve } from 'url';

@Component({
  selector: 'ngx-dropzone',
  templateUrl: './ngx-dropzone.component.html',
  styleUrls: ['./ngx-dropzone.component.scss'],
  providers: [NgxDropzoneService] // Create a new service instance for each component.
})
export class NgxDropzoneComponent {

  constructor(
    private host: ElementRef,
    public service: NgxDropzoneService
  ) { }

  @Input() label = 'Drop your files here (or click)';
  @Input() multiple = true;
  @Input() accept = '*';
  @Input() maxFileSize: number;
  @Input() showPreviews = false;
  @Input() preserveFiles = true;

  @Output() filesAdded = new EventEmitter<File[]>();
  @Output() filesRejected = new EventEmitter<File[]>();

  @HostBinding('class.disabled') @Input() disabled = false;
  @HostBinding('class.hovered') hovered = false;

  @ViewChild('fileInput') private fileInput: ElementRef;

  showFileSelector() {
    if (!this.disabled) {
      this.fileInput.nativeElement.click();
    }
  }

  reset() {
    this.service.reset();
  }

  onFilesSelected(event) {
    const files: FileList = event.target.files;

    this.handleFileDrop(files).then(() => {
      // Reset the file input value to trigger the event on new selection.
      (this.fileInput.nativeElement as HTMLInputElement).value = '';
    });
  }

  /**
   * UPDATE 10.03.2019:
   * Refactored to use HostListener and HostBindings to allow
   * for easier style overwriting from outside the component.
   */
  @HostListener('dragover', ['$event'])
  onDragOver(event) {
    if (this.disabled) {
      return;
    }

    this.preventDefault(event);
    this.hovered = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event) {
    this.hovered = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event) {
    this.preventDefault(event);
    this.hovered = false;
    this.handleFileDrop(event.dataTransfer.files);
  }

  private async handleFileDrop(files: FileList): Promise<void> {
    return new Promise<void>(resolve => {
      if (this.disabled) {
        return;
      }

      this.service.parseFileList(files, this.accept, this.maxFileSize,
        this.multiple, this.preserveFiles, this.showPreviews)
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
