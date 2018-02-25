---
title: blacklist
label: blacklist
---

param.listで指定した値とマッチしないか

param.listにはstring,RegExpもしくはそれらの配列が渡せます。

## オプション項目

| オプション | 型                                 | 初期値 | 説明             |
|------------|------------------------------------|--------|------------------|
| empty      | boolean                            | true   | 未入力の場合は検証しない |
| trim       | boolean                            | false  | 文字列左右端の空白を削除するか |
| list       | string, RegExp, string[], RegExp[] |        |      |
