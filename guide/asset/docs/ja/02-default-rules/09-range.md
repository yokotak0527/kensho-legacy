---
title: range
label: range
---

入力された文字列が指定した数の区間内(開区間)であるか  
区間はparam.minとparam.maxにより定義されます。その為、最低どちから1つは定義する必要があり省略した場合は以下のように発散します。

- (-∞, n)
- (n, ∞)

## オプション項目

| オプション | 型      | 初期値    | 説明             |
|------------|---------|-----------|------------------|
| empty      | boolean | true      | 未入力の場合は検証しない |
| trim       | boolean | false     | 文字列左右端の空白を削除するか |
| min        | number  | undefined | |
| max        | number  | undefined | |
