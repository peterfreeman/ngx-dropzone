import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {

	files: File[] = [];

	onFilesAdded(event) {
		console.log(event);
		this.files.push(...event.addedFiles);
	}

	onFilesRejected(event) {
		console.log(event);
	}

	onRemove(event) {
		console.log(event);
		this.files.splice(this.files.indexOf(event), 1);
	}
}
