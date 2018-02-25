---
title: number
label: number
---

入力された値が数値かどうか  
数値とはnumber型であるという意味です。1230も-12.5も数値になります。  

## オプション項目

| オプション名 | 型      | 初期値 | 説明 |
|--------------|---------|--------|------|
| allow2byte   | boolean | false  | 2バイト文字を受け付けるか |
| trim         | boolean | false  | 文字列左右端の空白を削除するか |
| empty        | boolean | true   | 未入力の場合は検証しない |

## 利用できるタグ

| タグ種別               | 補足 |
|------------------------|------|
| input[type="text"]     |      |
| input[type="password"] |      |
| input[type="search"]   |      |
| input[type="tel"]      |      |
| input[type="number"]   |      |
| textarea               |      |

## 依存しているプラグイン

- full2half
