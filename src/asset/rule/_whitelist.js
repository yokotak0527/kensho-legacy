(()=>{
  let rule  = Kensho.rule;

  /**
   * @param {String}   val
   * @param {Object}   param
   * @param {String[]} param.list
   */
  rule.add('whitelist', function(val, param){
    let result = false;
    if(!param.list) return result;

    for(let i = 0, l = param.list.length; i < l; i++){
      if(val === param.list[i]){
        result = true;
        break;
      }
    }
    return result;
  });

})();
