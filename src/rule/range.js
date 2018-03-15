export default (Kensho)=>{
    let rule  = Kensho.rule;

    /**
     * @param {(string|string[])} val                   -
     * @param {Object}            [param]               -
     * @param {number}            [param.min=undefined] -
     * @param {number}            [param.max=undefined] -
     * @param {boolean}           [param.trim=true]     -
     * @param {boolean}           [param.empty=true]    -
     * @param {boolean}           [type='']             - input type based on Kensho's own sorting rule
     *
     * @return {boolean}
     */
    let rangeFunc = function(val, param = {}, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!rangeFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            if(val === null) return false;

            let result = true;

            let trim  = typeof param.trim  === 'boolean' ? param.trim  : false;
            let empty = typeof param.empty === 'boolean' ? param.empty : true;

            if ( trim ) val = val.trim();
            if ( val.length === 0 ) return empty ? true : false;

            if(param.min === undefined && param.max === undefined) return true;

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

};
