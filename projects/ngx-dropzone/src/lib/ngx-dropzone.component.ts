import {
  Component,
  Input, Output, ElementRef, ViewChild,
  AfterViewInit, EventEmitter, TemplateRef,
  ViewEncapsulation,
  HostListener,
  HostBinding
} from '@angular/core';

export interface PreviewImage {
  data: string;
  filename: string;
}

@Component({
  selector: 'ngx-dropzone',
  templateUrl: './ngx-dropzone.component.html',
  styleUrls: ['./ngx-dropzone.component.scss']
})
export class NgxDropzoneComponent {

  constructor(
    private host: ElementRef
  ) { }

  @HostBinding('class.disabled') @Input() disabled = false;
  @Input() multiple = true;
  @Input() label = 'Drop your files here (or click)';
  @Input() accept = '*';
  @Input() maxFileSize: number;
  @Input() showImagePreviews = false;
  @Output() filesAdded = new EventEmitter<File[]>();

  @ViewChild('fileInput') fileInput: ElementRef;
  previewImages: PreviewImage[] = [];

  onFilesSelected(event) {
    const files: FileList = event.target.files;
    this.onFileDrop(files);
  }

  showFileSelector() {
    if (!this.disabled) {
      this.fileInput.nativeElement.click();
    }
  }

  /**
   * UPDATE 10.03.2019:
   * Refactored to use HostListener and HostBindings to allow
   * for easier style overwriting from outside the component.
   */
  @HostListener('dragover', ['$event'])
  onDragOver(event) {
    this.preventDefault(event);

    if (this.disabled) {
      return;
    }

    this.toggleHovered(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event) {
    this.toggleHovered(false);
  }

  @HostListener('drop', ['$event'])
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
     *
     * UPDATE 09.03.2019:
     * Refactored to one single loop and fixed bug where disabled multiple
     * selection might return invalid (unfiltered) files.
     * Added image preview option.
     */
    const exportFiles: File[] = [];
    const hasFiletypeFilter = this.accept !== '*';
    this.previewImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);

      if (hasFiletypeFilter && !this.accept.includes(file.type)) {
        continue;
      }

      if (this.maxFileSize && file.size > this.maxFileSize) {
        continue;
      }

      if (!this.multiple && exportFiles.length >= 1) {
        continue;
      }

      if (this.showImagePreviews) {
        if (!file.type.includes('image')) {
          continue;
        }

        const reader = new FileReader();
        reader.onload = e => {
          this.previewImages.push({
            data: (e.target as FileReader).result,
            filename: file.name
          });
        };

        reader.readAsDataURL(file);
      }

      exportFiles.push(file);
    }

    this.toggleHovered(false);
    this.filesAdded.next(exportFiles);
  }

  private toggleHovered(isHovered: boolean) {
    const el = this.host.nativeElement as HTMLElement;
    if (isHovered) {
      el.classList.add('hovered');
    } else {
      el.classList.remove('hovered');
    }
  }
}
