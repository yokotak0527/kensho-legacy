# Kensho

フォームバリデーションライブラリ

[![Build Status](https://travis-ci.org/yokotak0527/kensho.svg?branch=master)](https://travis-ci.org/yokotak0527/kensho)
[![codecov](https://codecov.io/gh/yokotak0527/kensho/branch/master/graph/badge.svg)](https://codecov.io/gh/yokotak0527/kensho)
![MIT licence](https://img.shields.io/badge/licence-MIT-brightgreen.svg)

- [ドキュメント](http://yokotakenji.me/product/kensho/doc/)
- [ガイド](http://yokotakenji.me/product/kensho/guide/)

## 仕様

- 依存しているライブラリ無し
- 2バイト文字のサポート
- オリジナルのバリデーションルール、プラグイン、フックが設定可能.
- フォームに不正な値があるかのチェック

| Browsers |
|----------|
| Chrome   |
| FireFox  |
| Safari   |
| IE11     |
| Edge     |

## インストール

```bash
$ npm install @yokotak0527/kensho
```

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

### バリデーションオプション指定

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

配列を使ってより短く書くことも出来ます。

```js
var kensho = new Kensho('#my-form');
kensho.add(
    'input[name=name]',
    'p.error-msg',
    {
        'age' : [
            'under 20 only.',
            { 'maxAge' : 20 }
        ],
    },
    'keyup|blur'
);
```

### 手動バリデーション

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

### 一括でバリデーション

if you want to stop the form send event, when a form has invalid values.

```js
var $send = document.querySelector('#send');
$send.addEventlistener('click', (e)=>{
    kensho.allValidate();
    if ( kensho.hasError() ) e.preventDefault();
});
```

### 静的なバリデーション

```js
Kensho.validate('email', 'a@a.com'); // return boolean
```

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

## チェンジログ

- regexpルールを追加
- 全てのルールで引数valが配列だった場合に再帰的に自身を実行するが、引数elemを渡していなかったので修正

### v1.1

- ルールのコールバック関数にHTMLElement配列を追加
- kensho.add関数のrule引数に配列をサポートするように変更
