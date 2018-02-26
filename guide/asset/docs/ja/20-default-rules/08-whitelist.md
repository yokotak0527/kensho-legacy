---
title: whitelist
label: whitelist
---

listで指定した値とマッチするか

param.listにはstring,RegExpもしくはそれらの配列が渡せます。

## オプション項目

| オプション | 型                                 | 初期値 | 説明             |
|------------|------------------------------------|--------|------------------|
| empty      | boolean                            | true   | 未入力の場合は検証しない |
| trim       | boolean                            | false  | 文字列左右端の空白を削除するか |
| list       | string, RegExp, string[], RegExp[] |        |      |

## 利用できるタグ

| タグ種別               | 補足 |
|------------------------|------|
| input[type="text"]     |      |
| input[type="password"] |      |
| input[type="search"]   |      |
| input[type="tel"]      |      |
| input[type="number"]   |      |
| textarea               |      |
