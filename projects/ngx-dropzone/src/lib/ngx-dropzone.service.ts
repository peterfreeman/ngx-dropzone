import { Injectable } from '@angular/core';

export interface FileSelectResult {

	/** The added files, emitted in the filesAdded event. */
	addedFiles: File[];

	/** The rejected files, emitted in the filesRejected event. */
	rejectedFiles: RejectedFile[];
}

export interface RejectedFile extends File {

	/** The reason the file was rejected. */
	reason?: RejectReason;
}

export type RejectReason = 'type' | 'size' | 'no_multiple';

/**
 * This service contains the filtering logic to be applied to
 * any dropped or selected file. If a file matches all criteria
 * like maximum size or accept type, it will be emitted in the
 * addedFiles array, otherwise in the rejectedFiles array.
 */
@Injectable()
export class NgxDropzoneService {

	parseFileList(files: FileList, accept: string, maxFileSize: number, multiple: boolean): FileSelectResult {

		const addedFiles: File[] = [];
		const rejectedFiles: RejectedFile[] = [];

		for (let i = 0; i < files.length; i++) {
			const file = files.item(i);

			if (!this.isAccepted(file, accept)) {
				this.rejectFile(rejectedFiles, file, 'type');
				continue;
			}

			if (maxFileSize && file.size > maxFileSize) {
				this.rejectFile(rejectedFiles, file, 'size');
				continue;
			}

			if (!multiple && addedFiles.length >= 1) {
				this.rejectFile(rejectedFiles, file, 'no_multiple');
				continue;
			}

			addedFiles.push(file);
		}

		const result: FileSelectResult = {
			addedFiles,
			rejectedFiles
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

	private rejectFile(rejectedFiles: RejectedFile[], file: File, reason: RejectReason) {

		const rejectedFile = file as RejectedFile;
		rejectedFile.reason = reason;

		rejectedFiles.push(rejectedFile);
	}
}
