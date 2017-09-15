/**
 * validate value
 * @param  {string}     name  - validation rule name.
 * @param  {string|int} value - 
 * @param  {object}     param - key/value variables for callback
 * @return {boolean}
 */
static validate(name, value, param = {}){
  let rule = this.rule.get(name);


  return rule.callback(value, param);
}

/**
 *
 *
 * @name   {string}
 * @name   {param}
 * @return {kensho} this
 */
validate(name, param = {}){
  console.log("member");
  let _    = this._.get(this);
  let unit = _.inputs[name];

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
  return this;
}
