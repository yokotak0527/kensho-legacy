(()=>{
  let rule  = Kensho.rule;

  /**
   * required
   */
  rule.add('required', function(val, param){
    return !val.trim() ? false : true;
  });

  /**
   * @param {object} param
   * @param {boolean} param.arrow2byte - 
   */
  rule.add('number', function(val, param = {}){
    let arrow2byte = param['arrow2byte'] ? param['arrow2byte'] : false;
    console.log(this);
    return true;
  });

})();
