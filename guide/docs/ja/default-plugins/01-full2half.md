---
title: full2half
label: full2half
---

2バイト文字を1バイト文字にマッピングします

```js
/**
 * @arg {string} val
 * @return {string}
 */
let full2half = Kensho.plugin.get('full2half').func;
console.log( full2half('２') === '2' ); // true
```

<table>
    <thead>
        <tr><th colspan="5">標準マップ</th></tr>
    </thead>
    <tbody>
        <tr>
            <td stlye="width:20%"> ０ </td><td stlye="width:20%"> １ </td><td stlye="width:20%"> ２ </td><td stlye="width:20%"> ３ </td><td stlye="width:20%"> ４ </td>
        </tr><tr>
            <td> ５ </td><td> ６ </td><td> ７ </td><td> ８ </td><td> ９ </td>
        </tr><tr>
            <td> ａ </td><td> ｂ </td><td> ｃ </td><td> ｄ </td><td> ｅ </td>
        </tr><tr>
            <td> ｆ </td><td> ｇ </td><td> ｈ </td><td> ｉ </td><td> ｊ </td>
        </tr><tr>
            <td> ｋ </td><td> ｌ </td><td> ｍ </td><td> ｎ </td><td> ｏ </td>
        </tr><tr>
            <td> ｐ </td><td> ｑ </td><td> ｒ </td><td> ｓ </td><td> ｔ </td>
        </tr><tr>
            <td> ｕ </td><td> ｖ </td><td> ｗ </td><td> ｘ </td><td> ｙ </td>
        </tr><tr>
            <td> ｚ </td><td>    </td><td>    </td><td>    </td><td>    </td>
        </tr><tr>
            <td> Ａ </td><td> Ｂ </td><td> Ｃ </td><td> Ｄ </td><td> Ｅ </td>
        </tr><tr>
            <td> Ｆ </td><td> Ｇ </td><td> Ｈ </td><td> Ｉ </td><td> Ｊ </td>
        </tr><tr>
            <td> Ｋ </td><td> Ｌ </td><td> Ｍ </td><td> Ｎ </td><td> Ｏ </td>
        </tr><tr>
            <td> Ｐ </td><td> Ｑ </td><td> Ｒ </td><td> Ｓ </td><td> Ｔ </td>
        </tr><tr>
            <td> Ｕ </td><td> Ｖ </td><td> Ｗ </td><td> Ｘ </td><td> Ｙ </td>
        </tr><tr>
            <td> Ｚ </td><td>    </td><td>    </td><td>    </td><td>    </td>
        </tr><tr>
            <td> － </td><td> （ </td><td> ） </td><td> ＿ </td><td> ／ </td>
        </tr><tr>
            <td> ＋ </td><td> ： </td><td> ； </td><td> ］ </td><td> ［ </td>
        </tr><tr>
            <td> ＠ </td><td> ！ </td><td> ＜ </td><td> ＞ </td><td> ？ </td>
        </tr><tr>
            <td> ｛ </td><td> ｝ </td><td> ＊ </td><td> ” </td><td> ’ </td>
        </tr><tr>
            <td> 〜 </td><td> ＾ </td><td> ￥ </td><td> ｜ </td><td> ＆ </td>
        </tr><tr>
            <td> ％ </td><td> ＃ </td><td> ＄ </td><td> 　 </td><td> ＝ </td>
        </tr>
    </tbody>
</table>

## マップ追加

独自のマップを追加追加することもできます。

```
let full2half = Kensho.plugin.get('full2half').func;
full2half.addMap({
    'あ' : 'a',
    'い' : 'i',
    'う' : 'u',
    'え' : 'e',
    'お' : 'o'
});
console.log(full2half('あいうえお')); // aiueo
```

full2halfは単純にキーを探し、値を返すだけの関数です。
