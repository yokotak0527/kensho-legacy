export default (Kensho)=>{
    let rule  = Kensho.rule;

    /**
     * @arg {(string|string[])} val                   -
     * @arg {Object}            [param]               -
     * @arg {number}            [param.min=undefined] -
     * @arg {number}            [param.max=undefined] -
     * @arg {boolean}           [param.trim=true]     -
     * @arg {boolean}           [param.empty=true]    -
     * @arg {boolean}           [type='']             - input type based on Kensho's own sorting rule
     * @arg {HTMLELement[]}     [elem=false]          - 
     *
     * @return {boolean}
     */
    let rangeFunc = function(val, param = {}, type = '', elem = false){
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
