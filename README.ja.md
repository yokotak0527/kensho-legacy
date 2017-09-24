# Kensho

[![Build Status](https://travis-ci.org/yokotak0527/kensho.svg?branch=master)](https://travis-ci.org/yokotak0527/kensho)

## 使い方

```js
// インスタンスの作成
let myform = new Kensho('#my-form');

// バリデーション項目の設定
myform.add(
  '#my-form input[name=name]', // input要素
  '#my-form .name-error', // エラーメッセージを表示する要素
  {
    required : 'this is required!',
    number : {
      param : {
        // ルールごとのパラメータ
      },
      errorMessage : 'number only'
    }
  },
  ['change'] // イベントトリガー
);
```

### 使い方フロー

1. Kenshoの読み込み
3. Kensho.configで設定 (オプション)
4. Kensho.pluginでプラグインの追加 (オプション)
5. Kensho.ruleでルールを追加 (オプション)
6. インスタンスの作成
7. バリデーション項目を設定
8. [インスタンス].hookでフックを追加 (オプション)

- - - - - - - - - - - - - - - - - - - - - - - - - - - -

## 設定

Kensho.js全体の動作設定を行います。  
設定はインスタンスを作成する前に行なってください。

以下の例はエラーメッセージの冗長的な出力を停止しています。

```js
Kensho.config.set('verbose', false);
```

| 設定一覧            | 初期値 | 説明 |
|---------------------|--------|------|
| lang                | 'en'   | 言語 |
| verbose             | true   | エラーメッセージの冗長的な出力 |
| errorMessageWrapper | 'li'   | エラーメッセージを包むHTMLタグを指定します |

- - - - - - - - - - - - - - - - - - - - - - - - - - - -

## フック

フックはWordPressライクにactionとfilterがあります。  
フックの登録はaction,filter問わず、hook.add()関数で登録します。

```js
/**
 * hook.add(type, hookName, callbackName, callback, priority = false)
 *
 * @param {string} type       - フックの種類 action か filter
 * @param {string} hookName   - フック名
 * @param {string} callback   - コールバック関数。
 * @param {number} [priority] - フックの優先順位。省略すると登録順になります。
*/
```

コールバック関数は内部的にthisを拘束しているので、アロー関数を利用しないでください。
返り値は不要です。またフックする場所によっては引数を取ることがあります。

### actionフック一覧

以下の例はインスタンスを作成したタイミングでmyHook関数を実行します。

```js
let kensho = new Kensho('form');

let myHook = function(){
  ...何かしらの処理
};
kensho.hook.add('action', 'init', myHook, 10);
```

| フック名           | 説明                     |
|--------------------|--------------------------|
| init               | インスタンス作成時に実行 |
| set-validate-filed | kensho.add()関数でバリデーション項目が設定された後に時に実行、登録項目を引数として渡す。 |

### filterフック一覧

以下の例はバリデーションを行う前にフォームに入力された値をトリムします。

```js
let kensho = new Kensho('form');

let myHook = function(val){
  return val.trim();
}
kensho.hook.add('filter', 'pre-validate-value', myHook, 10);
```

| フック名 | 説明 |
|----------|------|
| validate-filed | kensho.add()関数でバリデーション項目が設定される時に実行 |
| pre-validate-value | バリデーションを行う前に実行 |

### オリジナルフックを作成する

オリジナルのフックを作成することも可能です。

```js
/**
 * アクション
 * hook.action(name, param, thisObject)
 *
 * @param {string} name              - フック名
 * @param {object} [param={}]        - このフックのオブザーバに渡す引数
 * @param {object} [thisObject=this] - コールバック関数
*/
this.hook.action('first-step');

/**
 * フィルター
 * hook.filter(name, data, thisObject)
 *
 * @param {string} name              - フック名
 * @param {*}      data              - このフックのオブザーバに渡す値
 * @param {object} [thisObject=this] - コールバック関数
*/
let val = 'foo bar ';
let formatVal = this.hook.filter('message', val);
```

- - - - - - - - - - - - - - - - - - - - - - - - - - - -

## プラグイン

```js

/**
 * @example Kensho.plugin.add(name, callback, param, scope);
 * @param {string} name            - Plugin name
 * @param {function} callback        - Initialize function. Don't use arrow function.
 * @param {object} [param={}]      - Initialize function arguments
 * @param {string} [scope='class'] - 'class' or 'instance'
 *
 */

let myPluginInitialize = function(){
  return function(){
    console.log("hello");
  }
}
Kensho.plugin.add('myPlugin', callback, param, 'class');
```

- - - - - - - - - - - - - - - - - - - - - - - - - - - -

## ルール
