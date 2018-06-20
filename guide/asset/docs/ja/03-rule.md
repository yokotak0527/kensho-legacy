---
title: ルール
label: ルール
---

## ルールの追加

ルールの追加はKensho.rule.add()関数を利用します。

```js
/**
 * 
 * @arg {string}   name     - validation rule name
 * @arg {Function} callback - rule method
 *
 * @return {void}
 */
Kensho.rule.add(name, callback){};
```

callback関数は以下の引数をとります。

```js
/**
 * @arg {(string|string[])} val          - 入力された値、inputが複数ある場合は配列に格納されます
 * @arg {Object}            [param={}]   - callback内で利用するパラメータ
 * @arg {string}            [type='']    - Kenshoの独自ルールに基づいたinputのタイプ名が入ります
 * @arg {HTMLElement[]}     [elem=false] - 
 *
 * @return {boolean}
 */
callback(val, param = {}, type = '', elem = false){
    let result;
    // 何かしらの処理
    return result;
};
```

callback関数は必ずbooleanを返すようにしてください。

### callback関数のサンプル

```js
(()=>{
    let rule = Kensho.rule;

    /**
     *
     * @arg {(string|string[])} val                      -
     * @arg {Object}            [param={}]               -
     * @arg {number}            [param.maxAge=125]       -
     * @arg {boolean}           [param.allow2byte=false] -
     * @arg {boolean}           [param.trim=false]       -
     * @arg {boolean}           [param.empty=true]       -
     * @arg {string}            [type='']                - input type based on Kensho's own sorting rule
     *
     * @return {boolean}
     */
    let ageFunc = function(val, param = {}, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!ageFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            let maxAge        = param.maxAge ? param.maxAge : 125;
            let allow2byteFlg = typeof param.allow2byte === 'boolean' ? param.allow2byte : false;
            let trim          = typeof param.trim       === 'boolean' ? param.trim       : false;
            let empty         = typeof param.empty      === 'boolean' ? param.empty      : true;
            let full2half     = Kensho.plugin.get('full2half');

            if(allow2byteFlg) val = full2half.func(val);
            if(trim) val = val.trim();
            if ( val.length === 0 ) return empty ? true : false;

            if(val.length === 0 && empty) return true; // empty
            if(!/^[0-9]+$/.test(val) || /^0/.test(val)) return false;
            if(val > maxAge) return false; // limit
            return true;
        }
    }
    rule.add('age', ageFunc);

})();
```
