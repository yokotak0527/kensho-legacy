# Kensho

The JavaScript form validation library.

[![Build Status](https://travis-ci.org/yokotak0527/kensho.svg?branch=master)](https://travis-ci.org/yokotak0527/kensho)
[![codecov](https://codecov.io/gh/yokotak0527/kensho/branch/master/graph/badge.svg)](https://codecov.io/gh/yokotak0527/kensho)
![MIT licence](https://img.shields.io/badge/licence-MIT-brightgreen.svg)

- [document](http://yokotakenji.me/product/kensho/doc/)
- [Usage guide](http://yokotakenji.me/product/kensho/guide/)(japanese only..:frowning:)


## Feature

- No dependency libraries.
- Support 2byte charctors.
- It can be added your validation rules, plugin and hooks.
- It can be checked form has invalid values.

| Browsers |
|----------|
| Chrome   |
| FireFox  |
| Safari   |
| IE11     |
| Edge     |

## Install

```bash
$ npm install @yokotak0527/kensho
```

## How to use

```js
var kensho = new Kensho('#my-form');
kensho.add(
    'input[name=name]',
    'p.error-msg',
    {
        'required' : 'this is required.',
    },
    'keyup|blur'
);
```

### with validate options

```js
var kensho = new Kensho('#my-form');
kensho.add(
    'input[name=name]',
    'p.error-msg',
    {
        'age' : {
            'errorMessage' : 'under 20 only.',
            'param' : {
                'maxAge' : 20
            }
        },
    },
    'keyup|blur'
);
```

or you can write more simply with Array.

```js
var kensho = new Kensho('#my-form');
kensho.add(
    'input[name=name]',
    'p.error-msg',
    {
        'age' : [
            'under 20 only.',
            { 'maxAge' : 20 }
        ]
    },
    'keyup|blur'
);
```


### manual validate

```js
var kensho = new Kensho('#my-form');
kensho.add(
    'input[name=name]',
    'p.error-msg',
    {
        'required' : 'this is required.',
    },
    'keyup|blur'
);
kensho.validate('name'); // return boolean
```

### validation at once

if you want to stop the form send event, when a form has invalid values.

```js
var $send = document.querySelector('#send');
$send.addEventlistener('click', (e)=>{
    kensho.allValidate();
    if ( kensho.hasError() ) e.preventDefault();
});
```

### static validate

```js
Kensho.validate('email', 'a@a.com'); // return boolean
```

## Default validation rules list

01. required
02. age
03. range
04. number
05. email
06. whitelist
07. blacklist
08. halfsize
09. fullsize
10. regexp

## Change log

### v1.2.0

- added regexp rule.
- fixed elem argument of all rules when val argument is a array.

### v1.1.0

- added HTMLElement array arugment in rule callback functions.
- changed to support array in rule argument of kensho.add function.
