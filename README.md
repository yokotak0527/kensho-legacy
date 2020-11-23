# Kensho

The JavaScript validation library.

![NPM Download](https://img.shields.io/npm/dt/@yokotak0527/kensho)
![TravisCI](https://travis-ci.org/yokotak0527/kensho.svg?branch=master)
![open issue](https://img.shields.io/github/issues/yokotak0527/kensho)
![MIT licence](https://img.shields.io/github/license/yokotak0527/kensho)

## What can this do.

- simple and easy validation of values.
- multiple validations for one value.
- addition of your custom validation rules.
- IE11 support.

## Install

### npm

```bash
$ npm i @yokotak0527/kensho
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@yokotak0527/kensho/dist/bundle.iife.min.js"></script>
```

### Files

| Files                   | for...             |
|-------------------------|--------------------|
| dist/bundle.cjs.js      | CommonJS (default) |
| dist/bundle.cjs.min.js  | CommonJS           |
| dist/bundle.es.js       | ESModule (default) |
| dist/bundle.es.min.js   | ESModule           |
| dist/bundle.iife.js     | browser            |
| dist/bundle.iife.min.js | browser (default)  |

## Setup

### CommonJS

```js
const Kensho = require('@yokotak0527/kensho')
```

### ESModule

```js
import Kensho from '@yokotak0527/kensho'
```

## Validation

### A value validation.

```js
Kensho.validate('email', 'private@myhost.com')
// -> true
```

### The form inputs validation.

```html
<!-- HTML -->
<form class="form">
  <input type="email" k-name="sample" k-rule="email" k-event="keyup">
  <p k-name="sample.error"></p>
</form>
```

```js
// JS
const form = new Kensho('.form')
```

the above code, If the value entered does not conform to the email address specification, "The value failed email validation rule." will be displayed.

## For more details..

~~https://yokotak0527.gitbook.io/kensho/~~  
※ The content is old. Update soon. 😞