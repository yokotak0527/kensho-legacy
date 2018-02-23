---
title: is2byte
label: is2byte
---

与えられた文字が2バイト文字であればtrueを返し、そうでなければfalseを返します。

```js
/**
 * @arg {string} val 最初の1文字だけ評価します。つまり文字列ではなく文字を入れてください。
 * @return {boolean}
 */
let is2byte = Kensho.plugin.get('is2byte').func;
console.log( is2byte('あ') ); // true
```
