(()=>{
    let rule  = Kensho.rule;

    /**
     * @arg {any|any[]} val                -
     * @arg {Object}    [param={}]         -
     * @arg {boolean}   [param.trim=false] -
     * @arg {string}    [type='']          - input type based on Kensho's own sorting rule
     */
    Kensho.rule.add('required', function(val, param = {}, type = ''){
        if(Array.isArray(val)){
            let result;
            if(type === 'radio' || type === 'checkbox'){
                result = false;
                val.forEach( v => { if(v) result = true } );
            }else{
                result = true;
                val.forEach( v =>{
                    if(!this.check(v, param, type)) result = false;
                });
            }
            return result;
        }else{
            let trimFlg = param.trim === true ? true : false;
            if(typeof val === 'boolean') return val;
            if(trimFlg) val = val.trim();
            return val ? true : false;
        }
    });

})();
