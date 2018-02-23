(()=>{
    let rule  = Kensho.rule;

    /**
     * @param {String} val
     * @param {Object} [param={}]
     * @param {string} [type='']
     */
    let fullsizeFunc = function(val, param = {}, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!fullsizeFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            let result  = true;
            let is2byte = Kensho.plugin.get('is2byte');

            for(let i = 0, l = val.length; i < l; i++){
                if(!is2byte.func(val[i])){
                    result = false;
                    break;
                };
            }
            return result;
        }
    }
    rule.add('fullsize', fullsizeFunc);

})();
