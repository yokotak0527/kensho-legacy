(()=>{
    let rule  = Kensho.rule;

    /**
     * @param {string}   val
     * @param {Object}   [param]
     * @param {number}   [param.min]
     * @param {number}   [param.max]
     * @param {boolean}  [param.trim=true]
     * @param {boolean}  [param.empty=true]
     * @param {boolean}  [type='']
     */
    let rangeFunc = function(val, param = {}, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!rangeFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            let result = true;

            let trimFlg = typeof param.trim  === 'boolean' ? param.trim       : false;
            let empty   = typeof param.empty === 'boolean' ? param.empty      : true;

            if(trimFlg) val = val.trim();
            if ( empty && val.length === 0 ) return true;

            if(param.min === undefined && param.max === undefined) return result;

            if(param.min === undefined && typeof param.max === 'number'){
                if(val.length > param.max) result = false;
            }
            if(typeof param.min === 'number' && param.max === undefined){
                if(val.length < param.min) result = false;
            }
            if(param.min !== undefined && param.max !== undefined){
                if(val.length < param.min || val.length > param.max) result = false;
            }
            return result;
        }
    }
    rule.add('range', rangeFunc);

})();
