---
title: 使い方
label: 使い方
---

## 1. Kenshoライブラリを呼びます

```html
<script src="./kensho.js"></script>
```

依存しているライブラリはありません。  
基本的には単独で動作しますが、IE11に限ってはKenshoライブラリを呼ぶ前に
[babelのpolyfill](https://babeljs.io/docs/usage/polyfill/)などを呼んでください。

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
    ''
);
```

kensho.add()メソッドを利用すると、Kenshoは入力された内容を基に必要なデータを1つのオブジェクト(内部的にはユニットと呼んでいる)にまとめてkensho.inputsにキー/バリューで格納します。このときキーの名前がunitNameで定義出来ますが、unitNameを省略した場合はinputElement1つめのname属性の値が使われます。

### 注意

inputElementが1つのときは、unitNameの省略を気にする必要はありませんがinputElementが複数がある場合は気をつけてください。
想定外のunitNameが利用されている場合があります。  
詳しくは[aaa]({{@ja-multi-input-set}})

```
{{view @ja/multi-input-set }}
```
