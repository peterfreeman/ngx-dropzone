import { Injectable } from '@angular/core';

export interface FilePreview {
  data: string | ArrayBuffer;
  filename: string;
}

export interface FileSelectResult {
  addedFiles: File[];
  rejectedFiles: File[];
}

/**
 * UPDATE 04.04.2019:
 * Refactored to use service class to handle any
 * logic on the dropped files to allow for easier
 * unit tests and separation of concerns.
 */
@Injectable()
export class NgxDropzoneService {

  constructor() { }

  private fileCache: File[] = [];
  private rejectedFiles: File[] = [];
  previews: FilePreview[] = [];

  reset() {
    this.fileCache = [];
    this.rejectedFiles = [];
    this.previews = [];
  }

  async parseFileList(files: FileList, accept: string, maxFileSize: number, multiple: boolean,
    preserveFiles: boolean, showPreviews: boolean): Promise<FileSelectResult> {

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
     *
     * UPDATE 12.03.2019:
     * Refactored to use fileCache and emit all dropped files
     * since the last reset if [preserveFiles] is true.
     */
    const hasFiletypeFilter = accept !== '*';

    /**
     * UPDATE 12.03.2019:
     * Added option to preserve preview images.
     */
    if (!preserveFiles) {
      this.fileCache = [];
      this.rejectedFiles = [];
      this.previews = [];
    }

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);

      if (hasFiletypeFilter) {
        if (accept.endsWith('/*')) {
          // If a generic file type is provided, we check for a match.
          if (accept.split('/')[0] !== file.type.split('/')[0]) {
            this.rejectedFiles.push(file);
            continue;
          }
        } else {
          // Else an exact match is required.
          if (!accept.includes(file.type)) {
            this.rejectedFiles.push(file);
            continue;
          }
        }
      }

      if (maxFileSize && file.size > maxFileSize) {
        this.rejectedFiles.push(file);
        continue;
      }

      if (!multiple && this.fileCache.length >= 1) {
        if (!preserveFiles) {
          // Always emit the latest file if multi-selection and preservation are disabled.
          this.fileCache = [file];
        } else {
          continue;
        }
      }

      if (showPreviews) {
        if (file.type.startsWith('image')) {
          const preview = await this.readFile(file);

          if (preview) {
            this.previews.push(preview);
          }
        } else {
          const preview: FilePreview = {
            data: null,
            filename: file.name
          };

          this.previews.push(preview);
        }
      }

      this.fileCache.push(file);
    }

    const result: FileSelectResult = {
      addedFiles: this.fileCache,
      rejectedFiles: this.rejectedFiles
    };

    return result;
  }

  private async readFile(file: File): Promise<FilePreview> {
    return new Promise<FilePreview>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        const preview: FilePreview = {
          data: (e.target as FileReader).result,
          filename: file.name
        };

        return resolve(preview);
      };

      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}. No preview image created.`);
        return reject(null);
      }

      reader.readAsDataURL(file);
    })
  }
}
