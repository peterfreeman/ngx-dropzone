import { ApplicationRef, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NgxDropzoneModule } from '../ngx-dropzone.module';

describe('NgxDropzoneComponent', () => {
  @Component({
    template: '<ngx-dropzone [disableClick]="disableClick"></ngx-dropzone>',
  })
  class TestComponent {
    disableClick = false;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxDropzoneModule],
      declarations: [TestComponent],
    });
  });

  it('should not run change detection when the `ngx-dropzone` is clicked', () => {
    // Arrange
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    const appRef = TestBed.inject(ApplicationRef);
    const tickSpy = spyOn(appRef, 'tick').and.callThrough();
    const ngxDropzone = fixture.debugElement.query(By.css('ngx-dropzone'));
    const input = ngxDropzone.query(By.css('input'));
    const clickSpy = spyOn(input.nativeElement, 'click');

    // Act
    const event = new MouseEvent('click');
    ngxDropzone.nativeElement.dispatchEvent(event);

    // Assert
    expect(tickSpy).toHaveBeenCalledTimes(0);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('should not click the actual input if `disableClick` is truthuy', () => {
    // Arrange
    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentInstance.disableClick = true;
    fixture.detectChanges();

    const ngxDropzone = fixture.debugElement.query(By.css('ngx-dropzone'));
    const input = ngxDropzone.query(By.css('input'));
    const clickSpy = spyOn(input.nativeElement, 'click');

    // Act
    const event = new MouseEvent('click');
    ngxDropzone.nativeElement.dispatchEvent(event);

    // Assert
    expect(clickSpy).toHaveBeenCalledTimes(0);
  });
});
