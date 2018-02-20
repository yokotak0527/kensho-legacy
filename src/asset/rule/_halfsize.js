(()=>{
    let rule  = Kensho.rule;

    /**
     * @param {String} val
     * @param {Object} [param={}]
     */
    rule.add('halfsize', function(val, param = {}){
        let result  = true;
        let is1byte = Kensho.plugin.get('is1byte');

        for(let i = 0, l = val.length; i < l; i++){
            if(!is1byte.func(val[i])){
                result = false;
                break;
            };
        }
        return result;
    });

})();
