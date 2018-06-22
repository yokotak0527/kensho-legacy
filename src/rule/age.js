export default (Kensho)=>{
    let rule = Kensho.rule;

    /**
     *
     * @arg {(string|string[])} val                      -
     * @arg {Object}            [param={}]               -
     * @arg {number}            [param.maxAge=125]       -
     * @arg {boolean}           [param.allow2byte=false] -
     * @arg {boolean}           [param.trim=false]       -
     * @arg {boolean}           [param.empty=true]       -
     * @arg {string}            [type='']                - input type based on Kensho's own sorting rule
     * @arg {HTMLELement[]}     [elem=false]             - 
     *
     * @return {boolean}
     */
    let ageFunc = function(val, param = {}, type = '', elem = false){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!ageFunc(v, param, type, elem)) result = false;
            });
            return result;
        }else{
            if(val === null) return false;

            let maxAge        = param.maxAge ? param.maxAge : 125;
            let allow2byteFlg = typeof param.allow2byte === 'boolean' ? param.allow2byte : false;
            let trim          = typeof param.trim       === 'boolean' ? param.trim       : false;
            let empty         = typeof param.empty      === 'boolean' ? param.empty      : true;
            let full2half     = Kensho.plugin.get('full2half');
            let numberRule    = Kensho.rule.get('number');

            let isNumber = numberRule(val, { empty : empty, allow2byte : allow2byteFlg } );
            if ( !isNumber ) return false;

            if(allow2byteFlg) val = full2half.func(val);
            if(trim) val = val.trim();

            // ex. 0123
            if ( /^0[0-9\.,]+$/.test(val) ) return false;
            // ex. +20 -20
            if ( /^[\+\-]/.test(val) ) return false;
            // ex. 1.1
            if ( /(\.|,)/.test(val) ) return false;
            if ( val.length === 0 ) return empty ? true : false;

            val *= 1;

            if(val > maxAge || val < 0) return false; // limit
            return true;
        }
    }
    rule.add('age', ageFunc);

};
