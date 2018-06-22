export default (Kensho)=>{
    let rule  = Kensho.rule;
    
    /**
     * @arg {(string|string[])} val             -
     * @arg {Object}            [param]         -
     * @arg {RegExP}            [param.pattern] -
     * @arg {boolean}           [type='']       - input type based on Kensho's own sorting rule
     * @arg {HTMLELement[]}     [elem=false]    - 
     * 
     * @return {boolean}
     */
    let regexpFunc = function(val, param = {}, type = '', elem = false){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!regexpFunc(v, param, type, elem)) result = false;
            });
            return result;
        }else{
            let { pattern } = param;
            return pattern.test(val);
        }
    }
    rule.add('regexp', regexpFunc);
}
