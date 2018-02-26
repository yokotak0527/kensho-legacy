---
title: 使い方
label: 使い方
---

## 1. Kenshoライブラリを呼びます

```html
<script src="./kensho.js"></script>
```

## 2. form要素を用意します

```html
<form action="" id="my-form">
    <input type="text" name="my-name">
    <p class="error"></p>
</form>
```

## 3. Kenshoライブラリでバリデーションを行います

```js
/**
 * constructor(formElement)
 *
 * @arg {(string|HTMLElement)} - formタグへのCSSセレクタ文字列かHTMLELement
 */
var kensho = new Kensho('#my-form');

/**
 * kensho.add(inputElement, errorElement, rule, event = [''], unitName = '')
 *
 * @arg {(string|HTMLElement|HTMLElement[])} inputElement  - CSSセレクタ文字列かHTMLElement、もしくはそれらの配列
 * @arg {(string|HTMLElement)}               errorElement  - エラーメッセージを表示する要素へのCSSセレクタ文字列かHTMLElement
 * @arg {Object}                             rule          - バリデーションルールの定義
 * @arg {(string|string[])}                  [event=['']]  - バリデーションが実行されるトリガーとなるイベント名、もしくはそれらの配列
 * @arg {string}                             [unitName=''] - ユニットの名前、省略時はinputElement1つめのname属性の値が使われます
 */
kensho.add(
    'input[name="my-name"]',
    '.error',
    { // キーが利用する検証ルール名、値がエラー時の文章
        'required' : '必須項目です'
    },
    'keyup|blur' // バリデート処理が発火するイベント
);
```

kensho.add()メソッドを利用すると、Kenshoは入力された内容を基に必要なデータを1つのオブジェクト(内部的にはユニットと呼んでいる)にまとめてkensho.inputsにキー/バリューで格納します。このときキーの名前がunitNameで定義出来ますが、unitNameを省略した場合はinputElement1つめのname属性の値が使われます。

### 注意

inputElementが1つのときは、unitNameの省略を気にする必要はありませんがinputElementが複数がある場合は気をつけてください。
想定外のunitNameが利用されている場合があります。  
詳しくは[複数inputセット](/components/detail/ja-multi-input-set)

## ルールにパラメータを渡す

```
kensho.add(
    'input[name="my-name"]',
    '.error-msg',
    {
        'reqired'  : {
            'errorMessage' : '必須項目です',
            'param'        : { 'trim' : true }
        },
        'fullsize' : '全角のみ入力できます'
    },
    'keyup|blur'
);
```

## Kensho.jsの動作を変更する

静的メンバ関数Kensho.config.set()を使うことでKensho.jsの挙動を変更することが出来ます。

```
Kensho.config.set('errorMessageWrapper', 'li');
```

### {boolean} [verbose=true]

エラーを冗長的に出力するかを指定します。  

### {string} [errorMessageWrapper='span']

エラーメッセージを包むHTML要素を指定します。

### {string} [errorClassName='kensho-has-error']

エラーメッセージを包むHTML要素のclass属性に設定する値を指定します。
