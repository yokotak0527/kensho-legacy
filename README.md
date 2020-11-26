# Kensho

The JavaScript validation package.

![NPM Download](https://img.shields.io/npm/dt/@yokotak0527/kensho)
![TravisCI](https://travis-ci.org/yokotak0527/kensho.svg?branch=master)
![open issue](https://img.shields.io/github/issues/yokotak0527/kensho)
![MIT licence](https://img.shields.io/github/license/yokotak0527/kensho)

## What can this do.

- Simple and easy validation of values.
- Apply multiple validation rules for one value.
- Adjust the value before validation.
- Addition of your custom validation rules.

## Install

### npm

```bash
$ npm i @yokotak0527/kensho
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@yokotak0527/kensho/dist/bundle.iife.min.js"></script>
```

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

### A value validation

```js
// Kensho.validate(RULE NAME, VALUE)
Kensho.validate('email', 'private@myhost.com')
// -> true

// Kensho.validate(RULE NAME, VALUE, RULE OPTION)
Kensho.validate('letters', 'abcdefg', { range : { max : 5 } })
// false, Because the character count exceeds 5.
```

### The form inputs validation

```html
<!-- HTML -->

<form class="form">
  <input type="email" k-name="sample" k-rule="email" k-event="keyup" />
  <p k-name="sample.error"></p>
</form>
```

```js
// JS

const form = new Kensho('.form')
```

In the case of the above code, every time a `keyup` event occurs, it validates that the entered value meets the email validation rule.

Also, the following code validates the values entered when the `keyup` and `blur` events occur.

```html
<input type="email" k-name="sample" k-rule="email" k-event="keyup, blur" />
```

Of course, you can also set multiple validation rules.

```html
<input type="email" k-name="sample" k-rule="email, required" k-event="keyup, blur" />

<!-- with cutom messages -->
<input
  type="email"
  k-name="sample"
  k-rule="email, required"
  k-event="keyup, blur"
  k-message="{'email': 'invalid email format.', 'required': 'required.'}"
/>
```

If the validation rule has options...

```html
<input
  type="email"
  k-name="sample"
  k-rule="email, ['letters', {range : {max : 2}}]"
  k-event="keyup, blur"
/>
```

As you can see, the more complex the validation, the harder it is to read the code.
If you need complex validation, you might want to write the validation settings in JS.

```html
<!-- HTML -->

<form action="" class="myform">
  <input type="text" name="nickname">
  <p></p>
</form>
```

Assuming there is an HTML file like the one above, write JS code as below.

```js
// JS

const kensho = new Kensho('.myform', { search : false })
// By default, Kensho will look for HTML elements with Kensho attribute values
// in the specified form when you create an instance,
// but the If the option `search : false` is given, the operation will not be performed.

kensho.add({
  inputElement : 'input[name="nickname"]',
  errorElement : 'p',
  event        : ['keyup', 'blur'],
  rule         : ['required', ['letters', { range : { max : 10 } }]],
  errorMessage : {'required': 'required.', 'letters':'max charactor number is 10.'}
})
```

The `inputElement` and `errorElement` properties can be either query selectors as strings or `HTMLInputElement` directly.

## Add the validate rule

```js
Kensho.rule.add('myrule', (value, option, Kensho)=>{
  return value === 'hello'
})

Kensho.validate('myrule', 'hello')
// -> true
```

## Example

### pre-sending validation

```html
<!-- HTML -->

<form class="myform">
  <input type="email" k-name="sample" k-rule="email" k-event="keyup" />
  <p k-name="sample.error"></p>
</form>
```

```js
// JS
const formElm = document.querySelector('.myform')

const kensho  = new Kensho(formElm)

formElm.addEventListener('submit', (evt)=>{

  kensho.allValidate()

  if (kensho.hasError()) {
    evt.preventDefault()
    alert('input error')
  }
})
```

### ignore validations when the value is empty

```html
<form class="myform">
  <input type="email" k-name="sample" k-rule="email" k-event="keyup" k-allowempty />
  <p k-name="sample.error"></p>
</form>
```

## For more details..

~~https://yokotak0527.gitbook.io/kensho/~~  
※ The content is old. Update soon. 😞