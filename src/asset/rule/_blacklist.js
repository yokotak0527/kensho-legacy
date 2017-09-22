(()=>{
  let rule  = Kensho.rule;

  /**
   * @param {String}   val
   * @param {Object}   param
   * @param {String[]} param.list
   */
  rule.add('blacklist', function(val, param){
    let result = true;
    if(!param.list) return result;

    for(let i = 0, l = param.list.length; i < l; i++){
      if(val === param.list[i]){
        result = false;
        break;
      }
    }
    return result;
  });

})();
