(()=>{
  let rule  = Kensho.rule;

  /**
   * required
   */
  rule.add('required', function(val, param){
    return !val.trim() ? false : true;
  });

})();
