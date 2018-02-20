(()=>{
    let rule  = Kensho.rule;

    /**
     * @param {string|string[]}  val
     * @param {Object}           [param={}]
     * @param {number}           [param.maxAge=125]
     * @param {boolean}          [param.allow2byte=false]
     * @param {boolean}          [param.trim=false]
     * @param {boolean}          [param.empty=true]
     */
    rule.add('age', function(val, param = {}){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!this.check(v, param)) result = false;
            });
            return result;
        }else{
            let maxAge        = param.maxAage ? param.maxAage : 125;
            let allow2byteFlg = typeof param.allow2byte === 'boolean' ? param.allow2byte : false;
            let trimFlg       = typeof param.trim       === 'boolean' ? param.trim       : false;
            let empty         = typeof param.empty      === 'boolean' ? param.empty      : true;
            let full2half     = Kensho.plugin.get('full2half');

            if(allow2byteFlg) val = full2half.func(val);
            if(trimFlg) val = val.trim();

            if(val.length === 0 && empty) return true;           // empty
            if(!/^[0-9]{1,3}$/.test(val)) return false;          // ex. a1,1234, -5
            if(val.length !== 1 && /^0/.test(val)) return false; // first number is 0
            if(val > maxAge) return false;                       // limit
            return true;
        }
    }, ['number']);

})();
