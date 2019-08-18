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

    const result = service.parseFileList(fileList, '*', null, true);
    console.log('should return all files in the default configuration', result);
    expect(result.addedFiles.length).toEqual(fileList.length);
    expect(result.rejectedFiles.length).toEqual(0);
  }));

  it('should filter for accepted types', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    let fileList = new FileList();
    getRandomFileTypes().forEach(f => fileList.add(f));

    const result = service.parseFileList(fileList, 'image/*', null, true);
    console.log('should filter for accepted types', result);
    expect(result.addedFiles.length).toEqual(2);
    expect(result.rejectedFiles.length).toEqual(3);
  }));

  it('should filter for maximum file size', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    let fileList = new FileList();
    getRandomFileTypes().forEach(f => fileList.add(f));

    const result = service.parseFileList(fileList, '*', 50, true);
    console.log('should filter for maximum file size', result);
    expect(result.addedFiles.length).toEqual(3);
    expect(result.rejectedFiles.length).toEqual(2);
  }));

  it('should handle single-selection mode', inject([NgxDropzoneService], (service: NgxDropzoneService) => {
    let fileList = new FileList();
    getRandomFileTypes().forEach(f => fileList.add(f));

    const result = service.parseFileList(fileList, '*', null, false);
    console.log('should handle single-selection mode', result);
    expect(result.addedFiles.length).toEqual(1);
    expect(result.addedFiles[0].name).toEqual('myFile.mp4');
  }));
});
