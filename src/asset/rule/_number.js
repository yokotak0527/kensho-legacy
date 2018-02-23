(()=>{
    let rule = Kensho.rule;

    /**
     * 
     * @arg {string|string[]} val                      -
     * @arg {Object}          [param={}]               -
     * @arg {boolean}         [param.allow2byte=false] -
     * @arg {boolean}         [param.trim=false]       -
     * @arg {boolean}         [param.empty=true]       -
     * @arg {boolean}         [param.signed]           - 
     * @arg {boolean}         [param.point]            - 
     * @arg {string}          [type='']                - input type based on Kensho's own sorting rule
     *
     * @return {boolean}
     */
    let numberFunc = function(val, param = {}, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!numberFunc(v, param, type)) result = false;
            });
            return result;
        } else {
            let allow2byteFlg = typeof param.allow2byte === 'boolean' ? param.allow2byte : false;
            let trimFlg       = typeof param.trim       === 'boolean' ? param.trim       : false;
            let empty         = typeof param.empty      === 'boolean' ? param.empty      : true;
            let signed        = typeof param.signed     === 'boolean' ? param.signed     : false;
            let point         = typeof param.point      === 'boolean' ? param.point      : false; // decimal point
            let full2half     = Kensho.plugin.get('full2half');

            if(allow2byteFlg) val = full2half.func(val);
            if(trimFlg) val = val.trim();

            if(val.length === 0 && empty) return true;
            
            let regExpText = '^';
            let regExpPtn  = ['0-9'];
            
            if(signed) regExpText += '[\-\+]?';

            if(point){
                if(/^[\.]/.test(val))         return false;
                if(val.split('.').length > 2) return false;
                if(/[\.]$/.test(val))         return false;
                regExpPtn.push('\.');
            }

            regExpText += `[${regExpPtn.join('')}]+$`;
            let regExp = new RegExp(regExpText);
            
            if(!regExp.test(val)) return false;
            return true;
        }
    }
    rule.add('number', numberFunc);

})();
