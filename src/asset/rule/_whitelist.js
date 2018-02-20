(()=>{
    let rule  = Kensho.rule;

    /**
     * @param {string}   val
     * @param {Object}   param
     * @param {string[]} param.list
     */
    rule.add('whitelist', function(val, param){
        let result = false;
        if(!param.list) return result;

        for(let i = 0, l = param.list.length; i < l; i++){
            let reg = new RegExp(param.list[i]);
            if(reg.test(val)){
                result = true;
                break;
            }
        }
        return result;
    });

})();
