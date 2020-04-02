# Kensho

The JavaScript validation library.

## what it that do

- It can validates values simply.
- It can also validates input values in the form.
- You can add your own validation rules.
- It provides any plugins. And you can also add your own plugins.

## Validation

A value validation.

```js
Kensho.validate('email', 'private@myhost.com') // -> true
```

The form inputs validation.

```js
const form = new Kensho('#form')
form.allValidate()
form.hasError() // -> true | false
```

## Install

```bash
$ npm install yokotak0527/kensho
```

## More detail document

https://yokotak0527.gitbook.io/kensho/
