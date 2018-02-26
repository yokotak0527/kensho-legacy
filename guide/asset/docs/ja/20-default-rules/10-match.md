---
title: match
label: match
---

指定された複数の入力項目の値が全て等しい、もしくは指定された値と一致しているかどうか

## オプション項目

| オプション | 型      | 初期値 | 説明             |
|------------|---------|--------|------------------|
| empty      | boolean | true   | 未入力の場合は検証しない |
| val        | string  | ''     |  |

param.valが見指定の場合、入力項目が全て一致しているかどうかを検証します。  
param.valが指定された場合、入力項目が全てparam.valと等しいかどうかを検証します。

[サンプル](/components/detail/ja-match-rule-sample)

## 利用できるタグ

| タグ種別               | 補足 |
|------------------------|------|
| input[type="text"]     |      |
| input[type="password"] |      |
| input[type="search"]   |      |
| input[type="tel"]      |      |
| input[type="number"]   |      |
| textarea               |      |
