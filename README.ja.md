# Kensho

JavaScript バリデーションパッケージ

![NPM Download](https://img.shields.io/npm/dt/@yokotak0527/kensho)
![TravisCI](https://travis-ci.org/yokotak0527/kensho.svg?branch=master)
![open issue](https://img.shields.io/github/issues/yokotak0527/kensho)
![MIT licence](https://img.shields.io/github/license/yokotak0527/kensho)

## できること

- シンプルで簡単な値の検証
- 1つの値に対して複数の検証
- 検証する前に値を調整
- 独自の検証ルールを追加

## インストール

### npm

```bash
$ npm i @yokotak0527/kensho
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@yokotak0527/kensho/dist/bundle.iife.min.js"></script>
```

## セットアップ

### CommonJS

```js
const Kensho = require('@yokotak0527/kensho')
```

### ESModule

```js
import Kensho from '@yokotak0527/kensho'
```

## バリデーション

### 値の検証

```js
// Kensho.validate(RULE NAME, VALUE)
Kensho.validate('email', 'private@myhost.com')
// -> true

// Kensho.validate(RULE NAME, VALUE, RULE OPTION)
Kensho.validate('letters', 'abcdefg', { range : { max : 5 } })
// false, Because the character count exceeds 5.
```

### フォーム入力項目の検証

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

上記コードの場合、`keyup` イベントが発生するたびに、入力された値がメールアドレスの仕様を満たしているかどうかを検証し、満たしていない場合は「Value failed the email verification rule」と表示されます。

以下のコードでは、`keyup` や `blur` イベントが発生したときに入力された値を検証しています。

```html
<input type="email" k-name="sample" k-rule="email" k-event="keyup, blur" />
```

もちろん、複数のルールを設定することも可能です。

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

検証ルールにオプションがある場合...

```html
<input
  type="email"
  k-name="sample"
  k-rule="email, ['letters', {range : {max : 2}}]"
  k-event="keyup, blur"
/>
```

ご覧の通り、複雑なバリデーションになればなるほどコードを読むのが大変です。
複雑なバリデーションが必要な場合は、バリデーションの設定をJSで書いた方がいいかもしれません。

```html
<!-- HTML -->

<form action="" class="myform">
  <input type="text" name="nickname">
  <p></p>
</form>
```

上記のようなHTMLファイルがあると仮定して、以下のようにJSコードを記述します。

```js
// JS

const kensho = new Kensho('.myform', { search : false })
// デフォルトでは Kensho はインスタンスを作成する際に指定したフォームの Kensho 属性値を持つ
// HTML要素を探しますが オプション `search : false` が与えられている場合、その操作は行われません。

kensho.add({
  inputElement : 'input[name="nickname"]',
  errorElement : 'p',
  event        : ['keyup', 'blur'],
  rule         : ['required', ['letters', { range : { max : 10 } }]],
  errorMessage : {'required': 'required.', 'letters':'max charactor number is 10.'}
})
```

`inputElement` と `errorElement` プロパティは、文字列としてのクエリセレクタか `HTMLInputElement` を直接指定することができます。

## Add the validate rule

```js
Kensho.rule.add('myrule', (value, option, Kensho)=>{
  return value === 'hello'
})

Kensho.validate('myrule', 'hello')
// -> true
```

## 例

### 送信前に検証する

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

### 空値の場合は検証しない

```html
<form class="myform">
  <input type="email" k-name="sample" k-rule="email" k-event="keyup" k-allowempty />
  <p k-name="sample.error"></p>
</form>
```

## For more details..

~~https://yokotak0527.gitbook.io/kensho/~~  
※ The content is old. Update soon. 😞