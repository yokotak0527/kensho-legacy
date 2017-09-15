(()=>{
  let ruleBook = {};
  let rule = Object.create(null);

  /**
   *
   * add validataion rule.
   *
   * the callback variable must return type of boolean.
   * 
   * @param  {string}          name       - Validation rule name.
   * @param  {function}        callback   - Rule method
   * @param  {string|<string>} dependency - Other rule that the rule depend on.
   * @return {object} this
   */
  rule.add = function(name, callback, dependency = []){
    dependency = typeof dependency === 'string' ? [dependency] : dependency;
    ruleBook[name] = {
      callback   : callback,
      dependency : dependency
    };
  };

  /**
   * 
   * remove validation rule.
   *
   * @parm   {string} name - 
   * @return {object} this
   */
  rule.remove = function(name){
    delete ruleBook[name];
    return this;
  };
  Kensho.rule = rule;

  /**
   * 
   * return validation rule.
   * 
   * @return {object} this
   */
  rule.get = (name)=> ruleBook[name];


  Kensho.rule = rule;
})();
