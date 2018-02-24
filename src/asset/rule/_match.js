(()=>{
    let rule = Kensho.rule;

    /**
     *
     * @arg {(string|string[])}           val        -
     * @arg {(string|HTMLElement|Object)} [param={}] ~
     *
     * @return {boolean}
     */
    let matchFunc = function(val, param, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!matchFunc(v, param, type)) result = false;
            });
            return result;
        }else{

        }
        // param = typeof param === 'string' ? document.querySelector(param) : param;
        // return param.value === val;
    }
    rule.add('match', matchFunc);

})();
