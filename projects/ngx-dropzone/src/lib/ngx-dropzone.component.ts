import { Component, Input, Output, ElementRef, ViewChild, AfterViewInit, EventEmitter, TemplateRef } from '@angular/core';

@Component({
  selector: 'ngx-dropzone',
  templateUrl: './ngx-dropzone.component.html',
  styleUrls: ['./ngx-dropzone.component.scss']
})
export class NgxDropzoneComponent {

  @Input() disabled = false;
  @Input() multiple = true;
  @Input() label = 'Drop your files here (or click)';
  @Input() accept = '*';
  @Input() maxFileSize: number;
  @Input() customContent: TemplateRef<any>;
  @Output() filesDropped = new EventEmitter<File[]>();

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('dropzone') dropzone: ElementRef;

  onFilesSelected(event) {
    const files: FileList = event.target.files;
    this.onFileDrop(files);
  }

  showFileSelector() {
    if (!this.disabled) {
      this.fileInput.nativeElement.click();
    }
  }

  onDragover(event) {
    this.preventDefault(event);

    if (this.disabled) {
      return;
    }

    this.toggleHovered(true);
  }

  onDragleave() {
    this.toggleHovered(false);
  }

  onDrop(event) {
    this.preventDefault(event);
    this.onFileDrop(event.dataTransfer.files);
  }

  private preventDefault(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  private onFileDrop(files: FileList) {

    if (this.disabled) {
      return;
    }

    /**
     * UPDATE 27.01.2019:
     * Refactored the filter algorithm into one filter() method to gain
     * better performance by iterating only once.
     * See issue #1.
     */
    let exportFiles: File[] = [];

    if (this.multiple) {
      const hasFiletypeFilter = this.accept !== '*';

      exportFiles = this.toFileArray(files).filter(file => {
        if (hasFiletypeFilter && !this.accept.includes(file.type)) {
          return false;
        }

        if (this.maxFileSize && file.size > this.maxFileSize) {
          return false;
        }

        return true;
      });
    } else {
      exportFiles.push(files.item(0));
    }

    this.toggleHovered(false);
    this.filesDropped.next(exportFiles);
  }

  private toFileArray(files: FileList): File[] {
    const fileArray: File[] = [];

    for (let i = 0; i < files.length; i++) {
      fileArray.push(files.item(i));
    }

    return fileArray;
  }

  private toggleHovered(isHovered: boolean) {
    const el = this.dropzone.nativeElement as HTMLElement;
    if (isHovered) {
      el.firstElementChild.classList.add('hovered');
    } else {
      el.firstElementChild.classList.remove('hovered');
    }
  }
}
