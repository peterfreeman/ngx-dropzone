import { AfterViewInit, Component } from '@angular/core';
import { DropZoneFileModel } from 'projects/ngx-dropzone/src/lib/_data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  files: DropZoneFileModel[] = [];


  ngAfterViewInit() {

    const url = 'https://fakeimg.pl/440x230/282828/32eddd/?retina=1&text=ngx-dropzone-mock-img';

    const nameWithType = url.split('/')[url.split('/').length - 1];
    const name = nameWithType.split('.')[0];
    const type = nameWithType.split('.')[1] ? nameWithType.split('.')[1].toLowerCase() : 'png';

    var mockFile: File = {
      name: name,
      type: "image/" + type,
      size: 1024,
      arrayBuffer: null,
      lastModified: null,
      slice: null,
      stream: null,
      text: null,
    };

    this.files.push({
      isMock: true,
      file: mockFile,
      fileSrc: url
    })
  }

  onFilesAdded(event: any) {
    console.log(event);
    event.addedFiles.forEach((element: any) => {
      this.files.push({
        file: element,
        isMock: false
      })
    });
  }

  onFilesRejected(event: any) {
    console.log(event);
  }

  onRemove(event: DropZoneFileModel) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}
