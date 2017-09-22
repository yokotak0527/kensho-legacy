(()=>{
  let rule  = Kensho.rule;

  /**
   * @param {String}  val
   * @param {Object}  [param={}]
   * @param {Boolean} [param.trim=false]
   */
  Kensho.rule.add('required', function(val, param = {}){
    let trimFlg = param.trim === true ? true : false;

    if(trimFlg) val = val.trim();

    return val ? true : false;
  });

})();
