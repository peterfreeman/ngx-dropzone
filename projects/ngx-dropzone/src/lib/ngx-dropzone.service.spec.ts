import { TestBed, inject } from '@angular/core/testing';
import { NgxDropzoneService } from './ngx-dropzone.service';

// Mockup FileList class for unit tests
class MockFileList implements FileList {
  constructor(private files: File[]) {}

  get length(): number {
    return this.files.length;
  }

  item(index: number): File {
    return this.files[index];
  }

  add(file: File) {
    this.files.push(file);
  }

  [index: number]: File;
}


// Helper function to create a list of files
function getRandomFileTypes(): File[] {
  return [
    new File(['RandomStringContentToSimulateFileSize'], 'myFile.txt', { type: 'text/plain' }),
    new File(['RandomStringContentToSimulateBiggerFileSizeForUnitTest'], 'myFile.csv', { type: 'text/csv' }),
    new File(['RandomStringContentToSimulateFileSize'], 'myFile.jpg', { type: 'image/jpeg' }),
    new File(['RandomStringContentToSimulateFileSize'], 'myFile.png', { type: 'image/png' }),
    new File(['RandomStringContentToSimulateBiggerFileSizeForUnitTest'], 'myFile.mp4', { type: 'video/mp4' }),
  ]
}

function fileWithType(type: string): File {
  return new File(['anyFileBits'], 'anyFilename', { type });
}

function fileWithName(name: string): File {
  return new File(['anyFileBits'], name);
}

describe('NgxDropzoneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxDropzoneService]
    });
  });

  it('should be created', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    expect(service).toBeTruthy();
  }));

  it('should return all files in the default configuration', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    let fileList = new MockFileList(getRandomFileTypes());

    service.parseFileList(fileList, '*', null, true, true, false).then(result => {
      console.log('should return all files in the default configuration', result);
      expect(result.addedFiles.length).toEqual(fileList.length);
      expect(result.rejectedFiles.length).toEqual(0);
    });
  }));

  it('should filter for accepted type wildcard', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    const jpegFile = fileWithType('image/jpeg');
    const pngFile = fileWithType('image/png');
    const mp4File = fileWithType('video/mp4');
    let fileList = new MockFileList([jpegFile, pngFile, mp4File]);
    const accept = 'image/*';

    service.parseFileList(fileList, accept, null, true, true, false).then(result => {
      console.log('should filter for accepted mimetype wildcard', result);
      expect(result.addedFiles).toEqual([jpegFile, pngFile]);
      expect(result.rejectedFiles).toEqual([mp4File]);
    });
  }));

  it('should filter for multiple accepted types', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    const jpegFile = fileWithType('image/jpeg');
    const pngFile = fileWithType('image/png');
    const mp4File = fileWithType('video/mp4');
    let fileList = new MockFileList([jpegFile, pngFile, mp4File]);
    const accept = 'image/png,video/mp4';

    service.parseFileList(fileList, accept, null, true, true, false).then(result => {
      console.log('should filter for multiple accepted mimetypes', result);
      expect(result.addedFiles).toEqual([pngFile, mp4File]);
      expect(result.rejectedFiles).toEqual([jpegFile]);
    });
  }));

  it('should filter for accepted file extension and type', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    const fileWithJpegType = fileWithType('image/jpeg');
    const fileWithPngType = fileWithType('image/png');
    const fileWithTxtExtension = fileWithName('text.txt');
    let fileList = new MockFileList([fileWithJpegType, fileWithPngType, fileWithTxtExtension]);
    const accept = '.txt,image/png';

    service.parseFileList(fileList, accept, null, true, true, false).then(result => {
      console.log('should filter for accepted file extension and type', result);
      expect(result.addedFiles).toEqual([fileWithPngType, fileWithTxtExtension]);
      expect(result.rejectedFiles).toEqual([fileWithJpegType]);
    });
  }));

  it('should filter for accepted file extension ignoring case', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    const txtFile = fileWithName('text.txt');
    let fileList = new MockFileList([txtFile]);
    const accept = '.TXT';

    service.parseFileList(fileList, accept, null, true, true, false).then(result => {
      console.log('should filter for accepted file extension ignoring case', result);
      expect(result.addedFiles).toEqual([txtFile]);
    });
  }));

  it('should filter for accepted file type ignoring case', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    const txtFile = fileWithType('plain/text');
    let fileList = new MockFileList([txtFile]);
    const accept = 'PLAIN/TEXT';

    service.parseFileList(fileList, accept, null, true, true, false).then(result => {
      console.log('should filter for accepted file extension and type', result);
      expect(result.addedFiles).toEqual([txtFile]);
    });
  }));

  it('should filter for maximum file size', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    let fileList = new MockFileList(getRandomFileTypes());

    service.parseFileList(fileList, '*', 50, true, true, false).then(result => {
      console.log('should filter for maximum file size', result);
      expect(result.addedFiles.length).toEqual(3);
      expect(result.rejectedFiles.length).toEqual(2);
    });
  }));

  it('should handle single-selection mode', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    let fileList = new MockFileList(getRandomFileTypes());

    service.parseFileList(fileList, '*', null, false, true, false).then(result => {
      console.log('should handle single-selection mode', result);
      expect(result.addedFiles.length).toEqual(1);
      expect(result.addedFiles[0].name).toEqual('myFile.txt');
    });
  }));

  it('should consider file preservation', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    let fileList = new MockFileList(getRandomFileTypes());

    service.parseFileList(fileList, '*', null, true, true, false).then(firstResult => {
      service.parseFileList(fileList, '*', null, true, true, false).then(secondResult => {
        console.log('should consider file preservation (2)', secondResult);
        expect(secondResult.addedFiles.length).toEqual(2 * fileList.length);
      });
    });
  }));

  it('should create previews', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    let fileList = new MockFileList(getRandomFileTypes());

    service.parseFileList(fileList, '*', null, false, true, true).then(result => {
      console.log('should create previews', result);
      expect(service.previews.length).toEqual(result.addedFiles.length);
    });
  }));
});
