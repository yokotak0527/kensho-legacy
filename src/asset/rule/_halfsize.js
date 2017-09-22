(()=>{
  let rule  = Kensho.rule;

  /**
   * @param {String} val
   * @param {Object} [param={}]
   */
  rule.add('halfsize', function(val, param = {}){
    let result = true;

    for(let i = 0, l = val.length; i < l; i++){
      if(!Kensho.plugin.is1byte(val[i])){
        result = false;
        break;
      };
    }
    return result;
  });

})();
