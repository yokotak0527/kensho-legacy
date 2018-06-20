export default (Kensho)=>{
    let rule  = Kensho.rule;

    /**
     *
     * @arg {(string|string[])} val                -
     * @arg {Object}            [param={}]         -
     * @arg {boolean}           [param.trim=false] -
     * @arg {boolean}           [param.empty=true] -
     * @arg {string}            [type='']          - input type based on Kensho's own sorting rule
     * @arg {HTMLELement[]}     [elem=false]       - 
     *
     * @return {boolean}
     */
    let emailFunc = function(val, param = {}, type = '', elem = false){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!emailFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            if(val === null) return false;

            let result       = true;
            let trim         = typeof param.trim  === 'boolean' ? param.trim  : false;
            let empty        = typeof param.empty === 'boolean' ? param.empty : true;
            let halfsizeRule = Kensho.rule.get('halfsize');

            if(trim) val = val.trim();
            if ( val.length === 0 ) return empty ? true : false;

            result = halfsizeRule(val, {}, type);
            if(!result) return result;

            // https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
            let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(val);
        }
    }
    rule.add('email', emailFunc);
};
