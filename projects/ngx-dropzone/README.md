# ngx- dropzone

A lightweight and highly customizable Angular dropzone component to initialize file uploads.

[![NPM](https://img.shields.io/npm/v/ngx-dropzone.svg)](https://www.npmjs.com/package/ngx-dropzone) [![Build Status](https://travis-ci.com/peterfreeman/ngx-dropzone.svg?branch=master)](https://travis-ci.com/peterfreeman/ngx-dropzone)

<img src="_images/default.png">

<img src="_images/default_hovered.png">

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

### Attributes

| Property |   Type  | Description | Default  |
|--------------|-------|------------------------------------------------|---------|
| `[label]`    | `string`  | Change the label text.   | `'Drop your files here (or click)'` |
| `[multiple]` | `boolean` | Allow drop or selection of more than one file. | `true` |
| `[accept]`    | `string`  | Specify the accepted file types.   | `'*'` |
| `[maxFileSize]`    | `number`  | Set the maximum file size in bytes.   | `undefined` |
| `[showPreviews]`    | `boolean`  | Show file previews in the dropzone.   | `false` |
| `[preserveFiles]`    | `boolean`  | Preserve all selected files since the last reset.   | `true` |
| `[disabled]`    | `boolean`  | Disable any drop or click interaction.   | `false` |

### Methods

| Method |  Description | Return value  |
|--------------|-----------------------------------------------|---------|
| `showFileSelector()`    | Opens up the file selector dialog.   | `void` |
| `reset()`    | Resets all selected files.   | `void` |

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
<ngx-dropzone [showPreviews]="true" [preserveFiles]="false"></ngx-dropzone>
```

```html
<ngx-dropzone [showPreviews]="true" #dropzone></ngx-dropzone>
<button (click)="dropzone.reset()">Reset</button>
<button (click)="dropzone.showFileSelector()">Show file selector</button>
```

```html
<ngx-dropzone [disabled]="true"></ngx-dropzone>
```

<img src="_images/default_disabled.png">

### File selection event

Use the `(filesAdded)` output event to catch a file selection or drop.\
It returns a `File[]` of the dropped files that match the filters like file type and maximum size.\
Use the following example code to read the file's content.

Rejected files get ouput by the `(filesRejected)` event.

```html
<!-- in app.component.html -->
<ngx-dropzone (filesAdded)="onFilesAdded($event)"
              (filesRejected)="onFilesRejected($event)">
</ngx-dropzone>
```

```js
// in app.component.ts
onFilesAdded(files: File[]) {
  console.log(files);

  files.forEach(file => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent) => {
      const content = (e.target as FileReader).result;

      // this content string could be used directly as an image source
      // or be uploaded to a webserver via HTTP request.
      console.log(content);
    };

    // use this for basic text files like .txt or .csv
    reader.readAsText(file);

    // use this for images
    // reader.readAsDataURL(file);
  });
}

onFilesRejected(files: File[]) {
  console.log(files);
}
```

## Custom style component

You can provide a custom style for the dropzone container which still keeps the behaviour.\
When the user hovers over the component, the css class `hovered` is added. The `disabled` class will be added automatically.\
See the following example on how to do it and provide custom styles.

```html
<!-- in app.component.html -->
<ngx-dropzone label="This is my custom dropzone"
              class="custom-dropzone"
              (filesAdded)="onFilesAdded($event)">
</ngx-dropzone>
```

```scss
/* in app.component.scss */
ngx-dropzone {
  margin: 20px;

  &.custom-dropzone {
    height: 250px;
    background: #333;
    color: #fff;
    border: 5px dashed rgb(235, 79, 79);
    border-radius: 5px;
    font-size: 20px;

    &.hovered {
      border-style: solid;
    }
  }
}
```

<img src="_images/custom.png">

<img src="_images/custom_hovered.png">


You can still use the same properties like for the default styling.

```html
<!-- in app.component.html -->
<ngx-dropzone class="custom-dropzone" [showPreviews]="true"></ngx-dropzone>
```

<img src="_images/custom_preview.png">

```html
<ngx-dropzone class="custom-dropzone" [disabled]="true"></ngx-dropzone>
```

<img src="_images/custom_disabled.png">


## Licence

MIT © Peter Freeman
