export default (Kensho)=>{
    let rule = Kensho.rule;

    /**
     *
     * @arg {(string|string[])}           val                -
     * @arg {(string|HTMLElement|Object)} [param={}]         ~
     * @arg {boolean}                     [param.empty=true] -
     * @arg {string}                      [param.val='']     - fixed value
     * @arg {string}                      [type='']          - input type based on Kensho's own sorting rule
     *
     * @return {boolean}
     */
    let matchFunc = function(val, param = {}, type = ''){
        let empty = typeof param.empty === 'boolean' ? param.empty : true;

        if ( Array.isArray(val) ) {
            let arr      = val;
            let v        = param.val ? param.val : arr[0];
            let filtered = arr.filter( _v => v === _v );

            if(arr.length === filtered.length){
                if(!filtered[0].length) return empty;
                return true;
            }else{
                return false;
            }
        }else{
            if(val === null) return false;

            // do noting
            if(!param.val) return true;

            if(!val.length) return empty;
            return val === param.val ? true : false;
        }
    }
    rule.add('match', matchFunc);

};
