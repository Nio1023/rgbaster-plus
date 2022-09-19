[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

# rgbaster-plus

A dead simple, zero-dependency, promise-based typescript library for extracting the dominant color(s) from an image (in the browser).It's based on [rgbaster](https://github.com/briangonzalez/rgbaster.js) with some bugs fixed and type declaration files provided

## Installation

```
npm install --save rgbaster
```

## Usage

This library exports a default function which returns a promise resolving to a sorted array with
the most dominant color at index 0, secondary at index 1, so on and so forth.

```js
[
  { color: "rgb(0,0,255)", count: 86 },
  { color: "rgb(9,18,42)", count: 32 },
  { color: "rgb(120,8,202)", count: 3 },
];
```

```javascript
import analyze from "rgbaster";

const result = await analyze("/2px-blue-and-1px-red-image.png"); // also supports base64 encoded image strings

console.log(`The dominant color is ${result[0].color} with ${result[0].count} occurrence(s)`);
// => The  dominant color is rgb(0,0,255) with 2 occurrence(s)

console.log(`The secondary color is ${result[1].color} with ${result[1].count} occurrence(s)`);
// => The  secondary color is rgb(255,0,0) with 1 occurrence(s)
```

## Configuration options

You may pass an optional second parameter, an object, with the following options:

#### `ignore`

An array of colors to ignore (in the form of `rgb`) when counting colors.

```js
const result = await analyze("/image.png", { ignore: ["rgb(255,255,255)", "rgb(0,0,0)"] });
```

#### `scale`

In order to achieve greater speed, you can have `rgbaster` scale down the image we use internally prior to analysis, thus decreasing accuracy.

```js
const result = await analyze("/image.png", { scale: 0.6 });
```

[npm-image]: https://img.shields.io/npm/v/rgbaster-plus.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/rgbaster-plus
[downloads-image]: https://img.shields.io/npm/dm/rgbaster-plus.svg?style=flat-square
[downloads-url]: https://www.npmjs.com/package/rgbaster-plus
