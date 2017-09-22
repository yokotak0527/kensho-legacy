(()=>{
  let rule  = Kensho.rule;

  /**
   * @param {String}   val
   * @param {Object}   param
   * @param {String[]} param.list
   */
  rule.add('blacklist', function(val, param){
    if(!param.list) return true;

    for(let i = 0, l = param.list.length; i < l; i++){
      if(val === param.list[i]){
        return false;
        break;
      }
    }
    return true;
  });

})();
