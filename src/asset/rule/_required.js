(()=>{
  let rule  = Kensho.rule;

  /**
   * @param {String}  val
   * @param {Object}  [param={}]
   * @param {Boolean} [param.trim=false]
   */
  Kensho.rule.add('required', function(val, param = {}){
    let trimFlg = param.trim === true ? true : false;

    if ( val instanceof HTMLElement ) {
      let tagName = val.tagName.toLowerCase();
      // checkbox support
      if( tagName === 'input' && val.getAttribute('type') === 'checkbox' ){
        return val.checked;
      }
    } else {
        if(trimFlg) val = val.trim();

        return val ? true : false;
    }
  });

})();
