# Kensho

The JavaScript form validation library.

![](https://travis-ci.org/yokotak0527/kensho.svg?branch=master)

## How to use

```js
var kensho = new Kensho('#myform');
kensho.add(
  '#myform input[name=name]',
  '#myform p.name-error-msg',
  {
    'required' : 'this is required.',
  },
  ['keyup', 'blur']
);
```

## Feature

- jQuery is unnecessary.
- be able to add your plugin, validation rules and to set hooks.
