# NGX DROPZONE

A highly customizable Angular dropzone component to catch file uploads.

## Install

```
$ npm install --save ngx-dropzone
```

## Usage

Import the module

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxDropzoneModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```html
<ngx-dropzone></ngx-dropzone>
```

<img src="https://i.ibb.co/Zd3rJrz/Bildschirmfoto-2019-01-04-um-13-48-35.png" width="700px">

<img src="https://i.ibb.co/c3YwHgX/Bildschirmfoto-2019-01-04-um-13-49-00.png" width="700px">

## Options

Use the `[multiple]` input binding to accept more than one dropped file.
The default is `true`.

```html
<ngx-dropzone [multiple]="false"></ngx-dropzone>
```

Use the `[label]` input binding to change the label text.\
The default is `'Drop your files here (or click)'`.

```html
<ngx-dropzone [label]="'This is a custom label text'"></ngx-dropzone>
```

Use the `[accept]` input binding to specify the accepted file types. The value is forwarded to the native input binding. The default is `'*'`.

```html
<ngx-dropzone [accept]="'image/png,image/jpeg'"></ngx-dropzone>
```

Use the `[maxFileSize]` input binding to set the maximum file size in bytes. The default is `undefined`.

```html
<ngx-dropzone [maxFileSize]="2000"></ngx-dropzone>
```

Use the `[disabled]` input binding to disable any drop or click interaction. The default is `false`.

```html
<ngx-dropzone [disabled]="true"></ngx-dropzone>
```

<img src="https://i.ibb.co/5h5t4Hw/Bildschirmfoto-2019-01-04-um-13-49-24.png" width="700px">

Use the `(filesDropped)` output event to catch a file selection or drop.\
It returns a `File[]` of the dropped files that match the filters like file type and maximum size.

```html
<!-- in app.component.html -->
<ngx-dropzone (filesDropped)="onFilesDropped($event)"></ngx-dropzone>
```

```js
// in app.component.ts
onFilesDropped(event: File[]): void {
  console.log(event);
}
```

## Custom style component

You can provide a custom style for the dropzone container which behaves like the default one.\
When the user hovers over the component, the css class `hovered` is added.\
See the following example on how to do it and provide custom styles.

```html
<ngx-dropzone [customContent]="customDropzone" (filesDropped)="onFilesDropped($event)">
	<ng-template #customDropzone>
		<div class="custom-dropzone">
			This is my custom content
		</div>
	</ng-template>
</ngx-dropzone>
```

```scss
.custom-dropzone {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  border: 8px double #518;
  border-radius: 10px;

  &.hovered {
    border: 8px double #954;
    background: #FF4;
    font-size: 20px;
  }
}
```

<img src="https://i.ibb.co/N3VCtTb/Bildschirmfoto-2019-01-04-um-13-49-45.png" width="700px">

<img src="https://i.ibb.co/XjGFQmB/Bildschirmfoto-2019-01-04-um-13-49-56.png" width="700px">


Use can use the same properties like for the default styling.

```html
<ngx-dropzone [customContent]="customDropzone" [disabled]="true">
	<ng-template #customDropzone>
		<div class="custom-dropzone">
			This is my custom content
		</div>
	</ng-template>
</ngx-dropzone>
```

<img src="https://i.ibb.co/FBf27g2/Bildschirmfoto-2019-01-04-um-13-50-08.png" width="700px">


## Licence

MIT © Peter Freeman
