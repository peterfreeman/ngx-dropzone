# ngx-dropzone

A lightweight and highly customizable Angular dropzone component for file uploads.

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

## Features of v2

- [x] Default dropzone ngx-dropzone with hover effect
- [x] Make any target a valid dropzone with hover effect via directive
- [x] Label component
- [x] Allow multiple files
- [x] Accept only certain file types
- [x] Set a max file size
- [x] FilesChanged, FilesAdded, FilesRejected, FilesRemoved events
- [x] Support reactive forms (and ngModel?)
- [x] Image, Video and default preview components
- [x] Allow inheritance for custom preview components (Comp inheritance OR mixins ?) (http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)
- [x] Allow tab-selecting previews
- [x] Allow removing files
- [x] Disabled property
- [x] public method to show file selector
- [x] Orientation Property to either expand dz container or scroll horizontally
- [x] Add keyboard interaction
- [ ] Add documentation page

## Licence

MIT © Peter Freeman
