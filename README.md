# Kensho

The JavaScript validation library.

![NPM Download](https://img.shields.io/npm/dt/@yokotak0527/kensho)
![TravisCI](https://travis-ci.org/yokotak0527/kensho.svg?branch=master)
![open issue](https://img.shields.io/github/issues/yokotak0527/kensho)
![MIT licence](https://img.shields.io/github/license/yokotak0527/kensho)

## What this can do

- It can validates values simply.
- It can also validates input values in the form.
- You can add your own validation rules.
- It provides any plugins. And you can also add your own plugins.
- IE11 support.

## Validation

### A value validation.

```js
Kensho.validate('email', 'private@myhost.com') // -> true
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
// Assuming the use of "bundle.umd.js".s
const form = new yokotak0527.Kensho('.form')

// If you use 'bundle.esm.js' or 'bundle.cjs.js'...
const form = new Kensho('.form')
```

If the value entered does not conform to the email address specification, "The value failed email validation rule." will be displayed.

## Install

```bash
$ npm install @yokotak0527/kensho
```

| bundle file            |              |
|------------------------|--------------|
| dist/bundle.cjs.js     | for CommonJS |
| dist/bundle.cjs.min.js | for CommonJS |
| dist/bundle.esm.js     | for ESModule |
| dist/bundle.esm.min.js | for ESModule |
| dist/bundle.umd.js     | for browser  |
| dist/bundle.umd.min.js | for browser  |

## For more details..

https://yokotak0527.gitbook.io/kensho/
