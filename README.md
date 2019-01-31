# ngx- dropzone

A highly customizable Angular dropzone component to catch file uploads.

[![NPM](https://img.shields.io/npm/v/ngx-dropzone.svg)](https://www.npmjs.com/package/ngx-dropzone) [![Build Status](https://travis-ci.com/peterfreeman/ngx-dropzone.svg?branch=master)](https://travis-ci.com/peterfreeman/ngx-dropzone)

<img src="https://i.ibb.co/Zd3rJrz/Bildschirmfoto-2019-01-04-um-13-48-35.png">

<img src="https://i.ibb.co/c3YwHgX/Bildschirmfoto-2019-01-04-um-13-49-00.png">

## Install

```
$ npm install --save ngx-dropzone
```

## Usage

Import the module

```js
// in app.module.ts
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
<!-- in app.component.html -->
<ngx-dropzone></ngx-dropzone>
```

## Options

| Property |   Type  | Description | Default  |
|--------------|-------|------------------------------------------------|---------|
| `[multiple]` | `boolean` | Allow drop or selection of more than one file. | `true` |
| `[label]`    | `string`  | Change the label text.   | `'Drop your files here (or click)'` |
| `[accept]`    | `string`  | Specify the accepted file types.   | `'*'` |
| `[maxFileSize]`    | `number`  | Set the maximum file size in bytes.   | `undefined` |
| `[disabled]`    | `boolean`  | Disable any drop or click interaction.   | `false` |

### Examples

```html
<ngx-dropzone [multiple]="false"></ngx-dropzone>
```

```html
<ngx-dropzone [label]="'This is a custom label text'"></ngx-dropzone>
```

```html
<ngx-dropzone [accept]="'image/png,image/jpeg'"></ngx-dropzone>
```

```html
<ngx-dropzone [maxFileSize]="2000"></ngx-dropzone>
```

```html
<ngx-dropzone [disabled]="true"></ngx-dropzone>
```

<img src="https://i.ibb.co/5h5t4Hw/Bildschirmfoto-2019-01-04-um-13-49-24.png">

### File selection event

Use the `(filesDropped)` output event to catch a file selection or drop.\
It returns a `File[]` of the dropped files that match the filters like file type and maximum size.

```html
<!-- in app.component.html -->
<ngx-dropzone (filesDropped)="onFilesDropped($event)"></ngx-dropzone>
```

```js
// in app.component.ts
onFilesDropped(files: File[]): void {
  console.log(files);
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

<img src="https://i.ibb.co/N3VCtTb/Bildschirmfoto-2019-01-04-um-13-49-45.png">

<img src="https://i.ibb.co/XjGFQmB/Bildschirmfoto-2019-01-04-um-13-49-56.png">


You can use the same properties like for the default styling.

```html
<ngx-dropzone [customContent]="customDropzone" [disabled]="true">
	<ng-template #customDropzone>
		<div class="custom-dropzone">
			This is my custom content
		</div>
	</ng-template>
</ngx-dropzone>
```

<img src="https://i.ibb.co/FBf27g2/Bildschirmfoto-2019-01-04-um-13-50-08.png">


## Licence

MIT © Peter Freeman
