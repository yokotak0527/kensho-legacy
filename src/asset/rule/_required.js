(()=>{
    let rule  = Kensho.rule;

    /**
     * @arg {any}     val                - 
     * @arg {Object}  [param={}]         - 
     * @arg {boolean} [param.trim=false] - 
     * @arg {string}  [type='']          - input type based on Kensho's own sorting rule
     */
    Kensho.rule.add('required', function(val, param = {}, type = ''){
        let trimFlg = param.trim === true ? true : false;

        let result;
        if(type === 'radio' || type === 'checkbox'){
            result = false;
            if( Array.isArray(val) ){
                for(let i = 0, l = val.length; i < l; i++){
                    if(val[i]){
                        result = true;
                        break;
                    }
                }
            }else{
                
            }
        } else {
            if( Array.isArray(val) ){
                for(let i = 0, l = val.length; i < l; i++){
                    let v = val[i];
                    if(trimFlg) v = v.trim();
                    if(!v){
                        result = true;
                        break;
                    }
                }
            }
        }
        console.log(result);

        // if ( val instanceof HTMLElement ) {
        //     let tagName = val.tagName.toLowerCase();
        //     // checkbox support
        //     if( tagName === 'input' && val.getAttribute('type') === 'checkbox' ){
        //         return val.checked;
        //     }
        // } else {
        //     if(trimFlg) val = val.trim();
        //     return val ? true : false;
        // }
    });

})();
