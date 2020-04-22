# Kensho

The JavaScript validation library.

![MIT licence](https://img.shields.io/badge/licence-MIT-brightgreen.svg)

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
<form class=".form">
  <input type="email" k-name="sample" k-rule="email" k-event="keyup">
  <p k-name="sample.error"></p>
</form>
```

```js
// JS
const form = new Kensho('.form')
```

If the value entered does not conform to the email address specification, "The value failed email validation rule." will be displayed.

## Install

```bash
$ npm install yokotak0527/kensho
```

| bundle file       |              |
|-------------------|--------------|
| bundle.cjs.js     | for CommonJS |
| bundle.cjs.min.js | for CommonJS |
| bundle.ems.js     | for ESModule |
| bundle.ems.min.js | for ESModule |
| bundle.umd.js     | for browser  |
| bundle.umd.min.js | for browser  |

## For more details..

https://yokotak0527.gitbook.io/kensho/
