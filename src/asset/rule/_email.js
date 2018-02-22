(()=>{
    let rule  = Kensho.rule;

    /**
     * @param {string} val
     * @param {Object} [param={}]
     */
    let emailFunc = function(val, param = {}, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!emailFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            let result       = true;
            let halfsizeRule = Kensho.rule.get('halfsize');
            result = halfsizeRule(val, {
                
            }, type);
            
            // https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
            let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(val);
        }
    }
    rule.add('email', emailFunc);
})();
