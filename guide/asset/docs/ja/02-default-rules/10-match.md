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

[サンプル]({{ path '/components/detail/match-rule-sample' }})
