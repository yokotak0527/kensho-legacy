export default (Kensho)=>{
    let rule = Kensho.rule;

    /**
     *
     * @arg {string|string[]} val                      -
     * @arg {Object}          [param={}]               -
     * @arg {boolean}         [param.allow2byte=false] -
     * @arg {boolean}         [param.trim=false]       -
     * @arg {boolean}         [param.empty=true]       -
     * @arg {string}          [type='']                - input type based on Kensho's own sorting rule
     * @arg {HTMLELement[]}   [elem=false]             - 
     *
     * @return {boolean}
     */
    let numberFunc = function(val, param = {}, type = '', elem = false){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!numberFunc(v, param, type)) result = false;
            });
            return result;
        } else {
            if(val === null) return false;

            let allow2byteFlg = typeof param.allow2byte === 'boolean' ? param.allow2byte : false;
            let trimFlg       = typeof param.trim       === 'boolean' ? param.trim       : false;
            let empty         = typeof param.empty      === 'boolean' ? param.empty      : true;
            let full2half     = Kensho.plugin.get('full2half');

            if(allow2byteFlg) val = full2half.func(val);
            if(trimFlg) val = val.trim();

            if ( val.length === 0 ) return empty ? true : false;
            if(typeof val !== 'number' && typeof val !== 'string') return false;

            val *= 1;
            return isNaN(val) ? false : true;
        }
    }
    rule.add('number', numberFunc);

};
