(()=>{
  /**
   * validation rules
   * 
   * @namespace Kensho.rule
   */
  let rule = Object.create(null);
  
  let ruleBook = {};

  /**
   * add validation rule
   *
   * callback takes 2 arguments. the first arugment is input value. second is rule parameters.
   * callback must return result of validated input value as boolean type.
   *
   * @method  Kensho.rule.add
   * @version 0.0.1
   *
   * @param  {String}            name       validation rule name
   * @param  {Function}          callback   rule method.
   * @param  {(String|String[])} dependency other rule that the rule depend on
   * @return {void}
   */
  rule.add = function(name, callback, dependency = []){
    dependency = typeof dependency === 'string' ? [dependency] : dependency;
    ruleBook[name] = {
      check      : callback,
      dependency : dependency
    };
  };
  /**
   * remove validation rule.
   * 
   * @method  Kensho.rule.remove
   * @version 0.0.1
   *
   * @param  {String} name validation rule name
   * @return {Object}      this
   */
  rule.remove = function(name){
    delete ruleBook[name];
    return this;
  };
  /**
   * return validation rule.
   *
   * @method  Kensho.rule.get
   * @version 0.0.1
   * 
   * @param  {String} name validation rule name
   * @return {Object}
   */
  rule.get = (name)=> ruleBook[name];

  Kensho.rule = rule;
})();
