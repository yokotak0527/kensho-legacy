# Kensho

JavaScript バリデーションパッケージ

![NPM Download](https://img.shields.io/npm/dt/@yokotak0527/kensho)
![TravisCI](https://travis-ci.org/yokotak0527/kensho.svg?branch=master)
![open issue](https://img.shields.io/github/issues/yokotak0527/kensho)
![MIT licence](https://img.shields.io/github/license/yokotak0527/kensho)

## できること

- シンプルで簡単な値の検証
- 1つの値に対して複数の検証
- 検証する前に値にフィルターを適用
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

## 検証

デフォルトの検証ルール一覧を確認したい場合は[ガイド](https://yokotak0527.gitbook.io/kensho/rule/default-rules)か[コード](https://github.com/yokotak0527/kensho/blob/master/src/defaults/rules.ts)をご覧ください。

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

上記コードの場合 `keyup` イベントが発生するたびに、入力された値がメールアドレスの仕様を満たしているかどうかを検証し、満たしていない場合は「Value failed the email verification rule」と表示されます。

以下のコードでは、`keyup` や `blur` イベントが発生したときに入力された値を検証しています。

```html
<input type="email" k-name="sample" k-rule="email" k-event="keyup, blur" />
```

もちろん、複数のルールを設定することも可能です。

```html
<input type="email" k-name="sample" k-rule="email, required" k-event="keyup, blur" />

<!-- with custom messages -->
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

ご覧の通り、複雑な設定になればなるほどコードを読むのが大変です。  
複雑な設定が必要な場合は設定を JS で書いた方がいいかもしれません。

```html
<!-- HTML -->

<form action="" class="myform">
  <input type="text" name="nickname">
  <p></p>
</form>
```

上記のような HTML ファイルがあると仮定して、以下のように JS コードを記述します。

```js
// JS

const kensho = new Kensho('.myform', { search : false })
// デフォルトでは Kensho はインスタンスを作成する際に指定したフォームの Kensho 属性値を持つ
// HTML 要素を探しますが オプション `search : false` が与えられている場合、その操作は行われません。

kensho.add({
  inputElement : 'input[name="nickname"]',
  errorElement : 'p',
  event        : ['keyup', 'blur'],
  rule         : ['required', ['letters', { range : { max : 10 } }]],
  errorMessage : {'required': 'required.', 'letters':'max charactor number is 10.'}
})
```

`inputElement` と `errorElement` プロパティは、文字列としてのクエリセレクタか `HTMLInputElement` を直接指定することができます。

## フィルタリング

値を検証する前にフィルタリングしたい場合があります。  
例えば、全角文字列を半角文字列に変換してから検証したいなど。  
Kensho はこのようなフィルタリング機能をプラグインとして提供しています。

デフォルトのプラグイン一覧を確認したい場合は[コード](https://github.com/yokotak0527/kensho/blob/master/src/defaults/plugins.ts)をご覧ください。

```html
<form>
  <input
    type="text"
    k-name="text"
    k-rule="['regexp', {'regexp' : /^[abc]+$/ }]"
    k-event="keyup"
    k-filter="full2half"
  >
  <p k-name="text.error"></p>
</form>
<script>
  window.onload = function(){
    const kensho = new Kensho('form')
  }
</script>
```

上記コードは検証ルール `regexp` によって 文字 `"a"` か `"b"` か `"c"` のみ受付ますが、フィルター `full2half` によって検証前に値がフィルタリングされるので、フルサイズの `"ａ"` と `"ｂ"` と `"ｃ"` も受付ます。

## 検証ルールを追加する

```js
Kensho.rule.add('myrule', (value, option, Kensho)=>{
  return value === 'hello'
})

Kensho.validate('myrule', 'hello')
// -> true
```

## プラグインを追加する

```html
<form>
  <input type="text" k-name="text" k-rule="required" k-event="keyup" k-filter="myPlugin" />
  <p k-name="text.error"></p>
</form>
<script>
  window.onload = function(){
    Kensho.plugin.add('myPlugin', function myPlugin(value){
      // `this` is bind to the Kensho class.
      // do something...
      return value
    })
    const kensho = new Kensho('form')
  }
</script>
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

  kensho.validateAll()

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