(()=>{
  let rule  = Kensho.rule;

  /**
   * @param {String} val
   * @param {Object} [param={}]
   */
  rule.add('email', function(val, param = {}){
    // https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val);
  }, ['halfsize']);

})();
