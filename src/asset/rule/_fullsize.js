(()=>{
    let rule  = Kensho.rule;

    /**
     * @param {String} val
     * @param {Object} [param={}]
     */
    rule.add('fullsize', function(val, param = {}){
        let result  = true;
        let is2byte = Kensho.plugin.get('is2byte');

        for(let i = 0, l = val.length; i < l; i++){
            if(!is2byte.func(val[i])){
                result = false;
                break;
            };
        }
        return result;
    });

})();
