/**
 * 
 * validate value
 * 
 * @param  {string}     name  - validation rule name.
 * @param  {string|int} value - 
 * @param  {object}     param - key/value variables for callback
 * @return {boolean}
 */
static validate(name, value, param = {}){
  let rule = this.rule.get(name);
  return rule.check(value, param);
}

/**
 *
 *
 * @name   {string}
 * @name   {param}
 * @return {kensho} this
 */
validate(name, param = {}){
  let _          = this._.get(this);
  let unit       = _.inputs[name];
  let applyRules = unit.rule;
  let verbose    = Kensho.config.get('verbose');

  if(unit.type === 'text'){
    value = unit.inputElement.value;
  }else{
    value = this.formElement[unit.name] ? this.formElement[unit.name] : value;
  }
  if(unit.type === 'textarea'){
    // console.log();
  }
  
  unit.errorElement.innerHTML = '';
  unit.error                  = [];

  value = this.hook.filter('pre-validate-value', value, this);

  for(let key in applyRules){
    let result = Kensho.validate(key, value, applyRules[key].param);
  }
  // for(let i = 0, l = rule.length; i < l; i++){
  //   
  // }
  // console.log(value);


  return this;
}
