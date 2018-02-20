(()=>{
    let rule  = Kensho.rule;

    /**
     * @param {string}  val
     * @param {Object}  [param={}]
     * @param {boolean} [param.allow2byte=false]
     * @param {number}  [param.maxAge=125]
     * @param {boolean} [param.trim=false]
     */
    rule.add('age', function(val, param = {}){
        let maxAge        = param.maxAage             ? param.maxAage : 125;
        let allow2byteFlg = param.allow2byte === true ? true : false;
        let trimFlg       = param.trim       === true ? true : false;
        let full2half     = Kensho.plugin.get('full2half');

        if(allow2byteFlg) val = full2half.func(val);
        if(trimFlg) val = val.trim();

        if(!/^[0-9]{1,3}$/.test(val)) return false;          // ex. a1,1234, -5
        if(val.length !== 1 && /^0/.test(val)) return false; // first number is 0
        if(val > maxAge) return false;                       // limit
        return true;
    }, ['number']);

})();
