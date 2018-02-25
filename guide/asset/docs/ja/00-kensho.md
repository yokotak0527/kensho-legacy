---
title: Kensho.js
label: Kensho.js
---

Kensho.jsはフォームのバリデーションを行うJavaScriptのライブラリです。  
依存しているライブラリはありません。Kensho.jsは単独で動作します。

```js
kensho.add(
    'input[name="my-name"]',
    '.error-msg',
    {
        'reqired'  : '必須項目です',
        'fullsize' : '全角のみ入力できます'
    },
    'keyup|blur'
);
```

と書けば、input[name="my-name"]がkeyupかblurイベントを発火したときに該当するバリデーションが行われ、結果を.error-msgに出力します。

```js
kensho.validate('my-name');
```

また上記の様に書けば、すぐにバリデーションされます。

送信ボタンを押した時に全ての項目のバリデーションを行いたい？  
このような方法はどうでしょう。

```js
// 送信ボタン
let $sendBtn = document.querySelector('#send-btn');

$sendBtn.addEventListener('click', (e)=>{
    kensho.allValidate();
    if ( kensho.hasError() ) e.preventDefault();
});
```

送信ボタンがクリックされたら全ての項目の検証行い、エラー箇所があれば、送信処理を中断します。

## 動作環境
