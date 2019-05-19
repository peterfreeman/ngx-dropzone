import { TestBed, inject } from '@angular/core/testing';
import { NgxDropzoneService } from './ngx-dropzone.service';

// Mockup FileList class for unit tests
class FileList {
  private files: File[] = [];

  get length(): number {
    return this.files.length;
  }

  item(index: number): File {
    return this.files[index];
  }

  add(file: File) {
    this.files.push(file);
  }
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
    let fileList = new FileList();
    getRandomFileTypes().forEach(f => fileList.add(f));

    service.parseFileList(fileList, '*', null, true, true, false).then(result => {
      console.log('should return all files in the default configuration', result);
      expect(result.addedFiles.length).toEqual(fileList.length);
      expect(result.rejectedFiles.length).toEqual(0);
    });
  }));

  it('should filter for accepted types', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    let fileList = new FileList();
    getRandomFileTypes().forEach(f => fileList.add(f));

    service.parseFileList(fileList, 'image/*', null, true, true, false).then(result => {
      console.log('should filter for accepted types', result);
      expect(result.addedFiles.length).toEqual(2);
      expect(result.rejectedFiles.length).toEqual(3);
    });
  }));

  it('should filter for maximum file size', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    let fileList = new FileList();
    getRandomFileTypes().forEach(f => fileList.add(f));

    service.parseFileList(fileList, '*', 50, true, true, false).then(result => {
      console.log('should filter for maximum file size', result);
      expect(result.addedFiles.length).toEqual(3);
      expect(result.rejectedFiles.length).toEqual(2);
    });
  }));

  it('should handle single-selection mode', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    let fileList = new FileList();
    getRandomFileTypes().forEach(f => fileList.add(f));

    service.parseFileList(fileList, '*', null, false, true, false).then(result => {
      console.log('should handle single-selection mode', result);
      expect(result.addedFiles.length).toEqual(1);
      expect(result.addedFiles[0].name).toEqual('myFile.txt');
    });
  }));

  it('should consider file preservation', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    let fileList = new FileList();
    getRandomFileTypes().forEach(f => fileList.add(f));

    service.parseFileList(fileList, '*', null, true, true, false).then(firstResult => {
      service.parseFileList(fileList, '*', null, true, true, false).then(secondResult => {
        console.log('should consider file preservation (2)', secondResult);
        expect(secondResult.addedFiles.length).toEqual(2 * fileList.length);
      });
    });
  }));

  it('should create previews', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    let fileList = new FileList();
    getRandomFileTypes().forEach(f => fileList.add(f));

    service.parseFileList(fileList, '*', null, false, true, true).then(result => {
      console.log('should create previews', result);
      expect(service.previews.length).toEqual(result.addedFiles.length);
    });
  }));
});
