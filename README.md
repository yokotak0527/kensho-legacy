# Kensho

The JavaScript form validation library.

[![Build Status](https://travis-ci.org/yokotak0527/kensho.svg?branch=master)](https://travis-ci.org/yokotak0527/kensho)
[![codecov](https://codecov.io/gh/yokotak0527/kensho/branch/master/graph/badge.svg)](https://codecov.io/gh/yokotak0527/kensho)

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
