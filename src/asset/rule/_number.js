(()=>{
    let rule  = Kensho.rule;

    /**
     * @arg {string}  val                      - 
     * @arg {Object}  [param={}]               -
     * @arg {boolean} [param.allow2byte=false] -
     * @arg {boolean} [param.trim=false]       -
     *
     * @return {boolean}
     */
    rule.add('number', function(val, param = {}){
        let allow2byteFlg = param.allow2byte === true ? true : false;
        let trimFlg       = param.trim       === true ? true : false;
        let full2half = Kensho.plugin.get('full2half');

        if(allow2byteFlg) val = full2half.func(val);
        if(trimFlg) val = val.trim();

        if(!/^[0-9]*$/.test(val)) return false;
        return true;
    });

})();
