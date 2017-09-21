(()=>{
  let rule  = Kensho.rule;

  /**
   * required
   */
  rule.add('required', function(val, param){
    return !val.trim() ? false : true;
  });

  /**
   *
   * @param {Object} param
   * @param {Boolean} param.allow2byte - 
   */
  rule.add('number', function(val, param = {}){
    let allow2byte = param['allow2byte'] ? param['allow2byte'] : false;
    console.log(this);
    return false;
  });
  
  rule.add('test', function(val, param = {}){
    // let rule   = Kensho.rule.get('test');
    let result = true;
    // for(let i = 0, l = rule.length; i < l; i++){
    //   result = Kensho.rule.get(rule.length[i]).check(val, param);
    //   if(!result) break;
    // }
    // if(result) result = rule.check(val, param);
    return result;
  }, 'number');

})();
