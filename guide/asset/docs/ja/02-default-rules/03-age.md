---
title: age
label: age
---

入力された値が年齢の数値として妥当か

## オプション項目

| オプション | 型      | 初期値 | 説明             |
|------------|---------|--------|------------------|
| empty      | boolean | true   | 未入力の場合は検証しない |
| maxAage    | number  | 125    | 入力できる最大値 |
| allow2byte | boolean | false  | 2バイト文字を受け付けるか |
| trim       | boolean | false  | 文字列左右端の空白を削除するか |

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

## 依存しているルール

- number
