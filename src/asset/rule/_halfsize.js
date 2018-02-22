(()=>{
    let rule  = Kensho.rule;

    /**
     * 
     * @param {string} val
     * @param {Object} [param={}]
     * @param {string} [type='']
     */
    let halfsizeFunc = function(val, param = {}, type = ''){
        let result  = true;
        let is1byte = Kensho.plugin.get('is1byte').func;

        for(let i = 0, l = val.length; i < l; i++){
            if(!is1byte.func(val[i])){
                result = false;
                break;
            };
        }
        return result;
    }
    rule.add('halfsize', halfsizeFunc);

})();
