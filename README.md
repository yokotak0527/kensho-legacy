# Kensho

The JavaScript form validation library.

[![Build Status](https://travis-ci.org/yokotak0527/kensho.svg?branch=master)](https://travis-ci.org/yokotak0527/kensho)
[![codecov](https://codecov.io/gh/yokotak0527/kensho/branch/master/graph/badge.svg)](https://codecov.io/gh/yokotak0527/kensho)
![MIT licence](https://img.shields.io/badge/licence-MIT-brightgreen.svg)

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

## Feature

- No dependency libraries.
- Support 2byte charctors.
- It can be added your validation rules, plugin and hooks.

| Browsers |
|----------|
| Chrome   |
| FireFox  |
| Safari   |
| IE11     |
| Edge     |

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

## Usage guide

japanese only..

http://yokotakenji.me/product/kensho/guide/
