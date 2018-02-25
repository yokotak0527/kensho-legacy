# Kensho

フォームバリデーションライブラリ

[![Build Status](https://travis-ci.org/yokotak0527/kensho.svg?branch=master)](https://travis-ci.org/yokotak0527/kensho)
[![codecov](https://codecov.io/gh/yokotak0527/kensho/branch/master/graph/badge.svg)](https://codecov.io/gh/yokotak0527/kensho)
![MIT licence](https://img.shields.io/badge/licence-MIT-brightgreen.svg)

## 使い方

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

## 仕様

- 依存しているライブラリ無し
- 2バイト文字のサポート
- オリジナルのバリデーションルール、プラグイン、フックが設定可能

| Browsers |
|----------|
| Chrome   |
| FireFox  |
| Safari   |
| IE11     |
| Edge     |

## デフォルトバリデーションルール一覧

01. required
02. age
03. range
04. number
05. email
06. whitelist
07. blacklist
08. halfsize
09. fullsize
