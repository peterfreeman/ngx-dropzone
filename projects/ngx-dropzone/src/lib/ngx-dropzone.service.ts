import { Injectable } from '@angular/core';

export interface FileSelectResult {

	/** The added files, emitted in the filesAdded event. */
	addedFiles: File[];

	/** The rejected files, emitted in the filesRejected event. */
	rejectedFiles: File[];
}

/**
 * This service contains the filtering logic to be applied to
 * any dropped or selected file. If a file matches all criteria
 * like maximum size or accept type, it will be emitted in the
 * filesAdded event, otherwise in the filesRejected event.
 */
@Injectable()
export class NgxDropzoneService {

	private addedFiles: File[] = [];
	private rejectedFiles: File[] = [];

	parseFileList(files: FileList, accept: string, maxFileSize: number, multiple: boolean): FileSelectResult {

		this.addedFiles = [];
		this.rejectedFiles = [];

		for (let i = 0; i < files.length; i++) {
			const file = files.item(i);

			if (!this.isAccepted(file, accept)) {
				this.rejectedFiles.push(file);
				continue;
			}

			if (maxFileSize && file.size > maxFileSize) {
				this.rejectedFiles.push(file);
				continue;
			}

			if (!multiple && this.addedFiles.length >= 1) {
				// Always emit the latest file if multi-selection is disabled.
				this.rejectedFiles.push(file);
				continue;
			}

			this.addedFiles.push(file);
		}

		const result: FileSelectResult = {
			addedFiles: this.addedFiles,
			rejectedFiles: this.rejectedFiles
		};

		return result;
	}

	private isAccepted(file: File, accept: string): boolean {
		if (accept === '*') {
			return true;
		}

		const acceptFiletypes = accept.split(',').map(it => it.toLowerCase().trim());
		const filetype = file.type.toLowerCase();
		const filename = file.name.toLowerCase();

		const matchedFileType = acceptFiletypes.find(acceptFiletype => {
			// check for wildcard mimetype (e.g. image/*)
			if (acceptFiletype.endsWith('/*')) {
				return filetype.split('/')[0] === acceptFiletype.split('/')[0];
			}

			// check for file extension (e.g. .csv)
			if (acceptFiletype.startsWith(".")) {
				return filename.endsWith(acceptFiletype);
			}

			// check for exact mimetype match (e.g. image/jpeg)
			return acceptFiletype == filetype;
		});

		return !!matchedFileType;
	}
}
