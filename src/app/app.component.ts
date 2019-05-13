import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  onFilesAdded(event: File[]) {
    console.log(event);
  }

  onFilesRejected(event: File[]) {
    console.log(event);
  }
}
