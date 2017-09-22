(()=>{
  let rule  = Kensho.rule;

  /**
   * @param {String}  val
   * @param {Object}  [param={}]
   * @param {Boolean} [param.allow2byte=false]
   * @param {Boolean} [param.trim=false]
   */
  rule.add('number', function(val, param = {}){
    let allow2byteFlg = param.allow2byte === true ? true : false;
    let trimFlg       = param.trim       === true ? true : false;

    if(allow2byteFlg) val = Kensho.plugin.full2half(val);
    if(trimFlg) val = val.trim();

    if(!/^[0-9]*$/.test(val)) return false;
    return true;
  });

})();
