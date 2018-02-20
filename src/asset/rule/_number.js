(()=>{
    let rule  = Kensho.rule;

    /**
     * @arg {string|string[]}  val             -
     * @arg {Object}  [param={}]               -
     * @arg {boolean} [param.allow2byte=false] -
     * @arg {boolean} [param.trim=false]       -
     *
     * @return {boolean}
     */
    rule.add('number', function(val, param = {}){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!this.check(v, param)) result = false;
            });
            return result;
        } else {
            let allow2byteFlg = typeof param.allow2byte === 'boolean' ? param.allow2byte : false;
            let trimFlg       = typeof param.trim       === 'boolean' ? param.trim       : false;
            let empty         = typeof param.empty      === 'boolean' ? param.empty      : true;
            let full2half      = Kensho.plugin.get('full2half');

            if(allow2byteFlg) val = full2half.func(val);
            if(trimFlg) val = val.trim();

            if(val.length === 0 && empty) return true;
            if(!/^[0-9]*$/.test(val)) return false;
            return true;
        }
    });

})();
