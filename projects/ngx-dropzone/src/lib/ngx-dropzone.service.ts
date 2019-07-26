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

		const hasAcceptFilter = accept !== '*';
		const hasGenericAcceptFilter = accept.endsWith('/*');
		const acceptedGenericType = accept.split('/')[0];

		for (let i = 0; i < files.length; i++) {
			const file = files.item(i);

			if (hasAcceptFilter) {
				if (hasGenericAcceptFilter) {
					// If a generic file type is provided, we check for a match.
					const providedGenericType = file.type.split('/')[0];

					if (acceptedGenericType !== providedGenericType) {
						this.rejectedFiles.push(file);
						continue;
					}
				} else {
					// Else an exact match is required.
					const hasFileType = !!file.type;

					if (!accept.includes(file.type) || !hasFileType) {
						this.rejectedFiles.push(file);
						continue;
					}
				}
			}

			if (maxFileSize && file.size > maxFileSize) {
				this.rejectedFiles.push(file);
				continue;
			}

			if (!multiple && this.addedFiles.length >= 1) {
				// Always emit the latest file if multi-selection is disabled.
				this.addedFiles = [file];
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
}
