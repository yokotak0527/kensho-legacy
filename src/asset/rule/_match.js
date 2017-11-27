(()=>{
  let rule  = Kensho.rule;

  /**
   * @param {String}       val
   * @param {String|HTML}  param
   */
  rule.add('match', function(val, param){
    param = typeof param === 'string' ? document.querySelector(param) : param;
    return param.value === val;
  });

})();
