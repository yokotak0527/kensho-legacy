---
title: 基本的な使い方

---

```html
<form action="" id="order-form">
    <input type="text" name="your-name">
    <p class="error"></p>
    <input type="age" name="your-age">
    <p class="error"></p>
</form>
```

```js
var validate = new Kensho('#order-form');
validate.add()
```
