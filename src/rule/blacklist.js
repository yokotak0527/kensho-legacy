export default (Kensho)=>{
    let rule  = Kensho.rule;

    /**
     *
     * @arg {(string|string[])}     val                -
     * @arg {Object}                [param={}]         -
     * @arg {(string|RegExp|any[])} param.list         -
     * @arg {boolean}               [param.trim=false] -
     * @arg {boolean}               [param.empty=true] -
     * @arg {string}                [type='']          - input type based on Kensho's own sorting rule
     * @arg {HTMLELement[]}         [elem=false]       - 
     *
     * @return {boolean}
     */
    let blacklistFunc = function(val, param, type = '', elem = false){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!blacklistFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            if(val === null) return false;

            let result = true;
            let trim   = typeof param.trim  === 'boolean' ? param.trim  : false;
            let empty  = typeof param.empty === 'boolean' ? param.empty : true;

            if(trim) val = val.trim();
            if(val.length === 0) return empty ? true : false;
            if(!param.list) return true; // do noting

            param.list = Array.isArray(param.list) ? param.list : [param.list];

            for(let i = 0, l = param.list.length; i < l; i++){
                let reg;
                if(toString.call(param.list[i]) === '[object RegExp]'){
                    reg = param.list[i];
                }else{
                    reg = new RegExp(param.list[i]);
                }
                if(reg.test(val)){
                    result = false;
                    break;
                }
            }
            return result;
        }

    }
    rule.add('blacklist', blacklistFunc);

};
