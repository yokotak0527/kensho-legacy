---
title: is1byte
label: is1byte
---

与えられた文字が1バイト文字であればtrueを返し、そうでなければfalseを返します。

```js
/**
 * @arg {string} val 最初の1文字だけ評価します。つまり文字列ではなく文字を入れてください。
 * @return {boolean}
 */
let is1byte = Kensho.plugin.get('is1byte').func;
console.log( is1byte('a') ); // true
```
