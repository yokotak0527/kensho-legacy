(()=>{
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
     *
     * @return {boolean}
     */
    let ageFunc = function(val, param = {}, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!ageFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            let maxAge        = param.maxAge ? param.maxAge : 125;
            let allow2byteFlg = typeof param.allow2byte === 'boolean' ? param.allow2byte : false;
            let trim          = typeof param.trim       === 'boolean' ? param.trim       : false;
            let empty         = typeof param.empty      === 'boolean' ? param.empty      : true;
            let full2half     = Kensho.plugin.get('full2half');

            if(allow2byteFlg) val = full2half.func(val);
            if(trim) val = val.trim();
            if ( val.length === 0 ) return empty ? true : false;

            if(val.length === 0 && empty) return true; // empty
            if(!/^[0-9]+$/.test(val) || /^0/.test(val)) return false;
            if(val > maxAge) return false; // limit
            return true;
        }
    }
    rule.add('age', ageFunc);

})();
