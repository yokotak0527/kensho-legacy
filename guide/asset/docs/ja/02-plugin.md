---
title: プラグイン
label: プラグイン
---

## プラグインの単独利用

```js
var full2half = Kensho.plugin.get('full2half').func;
console.log(full2half('２')); // 2
```

## プラグインの追加

```js
let myFunc = function(val){
    // 何かしらの処理
    return val;
}
Kensho.plugin.add('full2half', myFunc);
```
