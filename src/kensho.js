class Kensho{

/**
 *
 * @param  {string|HTMLElement} formElement             - 
 * @param  {object}             [option={}]             - 
 * @param  {string}             [option.errorWrap=span] - 
 * @return {Kensho}
 */
constructor(formElement, option = {}){
  if(Kensho.isInitialize) Kensho.init();
  formElement = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;

  this.formElement = formElement;
  this.rule        = Kensho.rule;
  this.hook        = new Kensho.Hook(this);
  
  // soft private
  this._ = new Map();
  this._.set(this, Object.create(null));
  Object.defineProperty(this, '_', { enumerable : false });
  let _ = this._.get(this);
  _.inputs = {};
  

  // console.log(form instanceof HTMLElement);
  formElement.classList.add('kensho-form');

  // this.hook.addAction('init');
}




// Kensho.addRule

/**
 * 
 * Add validation field.
 *
 * About of [event=['']] param.
 * it fundamentally set event.type name.
 * but, it has especial names, as follows.
 *   init - when in add() method
 * 
 * @param {string|HTMLElement|array<HTMLElement>} inputElement - Form input HTML element or its CSS selector string.
 * @param {string|HTMLElement}                    errorElement - Wrapper element of output error message or its CSS selector string.
 * @param {object}                                rule         - The key is rule name. The value is error message.
 * @param {string|<string>}                       [event=['']] - trigger event.
 * @return {Kensho} this
 */
add(inputElement, errorElement, rule, event = [''], param = {}){

  // for example, name attribute of radio buttons are seted same value.
  // querySelector return matched first HTML element and 2nd and subsequent matched element is ignored.
  // so, InputElement not use querySelector but use querySelectorAll.
  // as a result of it, inputElement type is a array.
  inputElement = typeof inputElement === 'string' ? document.querySelectorAll(inputElement) : Array.isArray(inputElement) ? inputElement : [inputElement];
  errorElement = typeof errorElement === 'string' ? document.querySelector(errorElement) : errorElement;
  event        = typeof event        === 'string' ? [event] : event;

  let _       = this._.get(this);
  let name    = inputElement[0].getAttribute('name');
  let tagName = inputElement[0].tagName.toLowerCase();
  let type    = null;
  if(tagName === 'input') type = inputElement[0].getAttribute('type');
  else type = tagName;
  if(type !== 'radio') inputElement = inputElement[0];

  let unit = _.inputs[name] = {
    name         : name,
    inputElement : inputElement,
    errorElement : errorElement,
    inputTagName : tagName,
    type         : type,
    rule         : rule,
    error        : []
    // name         : name,
    // $input       : $input,
    // inputTagName : tagName,
    // type         : type,
    // $err         : $err,
    // validate     : validate,
    // errMsg       : errMsg,
    // event        : event,
    // errors       : [],
    // zeroThrough  : true
  }
  
  // Add event handler
  event.forEach((name, i)=>{
    if(name === 'init'){
      if(unit.type === 'radio'){
        unit.inputElement.forEach((input, i)=>{
          this.validate(unit.name);
        });
      }else{
        this.validate(unit.name);
      }
    }else{
      if(unit.type === 'radio'){
        unit.inputElement.forEach((input, i)=>{
          input.addEventListener(name, ()=>{
            this.validate(unit.name);
          });
        });
      }else{
        unit.inputElement.addEventListener(name, ()=>{
          this.validate(unit.name);
        });
      }
    }
  });

  return this;
  // this.addAction('add');
  
}

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

}

(()=>{
  let _c = {};
  // ===========================================================================
  // 
  // DEFAULT CONFIGURATIONS.
  // 
  // ===========================================================================
  _c.lang                = 'en'; // language
  _c.errorMessageWrapper = 'li';

  Kensho.config = {
    /**
     * get configuration value
     * 
     * @param  {string} key - Configuration key name
     * @return {*}
     */
    get(key){
      return _c[key];
    },
    /**
     * Set configuration value
     * 
     * @param {string|obj} key - Configuration key name or Object.
     * @param void
     */
    set(key, val){
      if(typeof key === 'object') for(let _k in key) this.set(_k, key[_k]);
      _c[key] = val;
    }
  }
  
})();

(()=>{
  let map  = new Map();
  let _get = self => map.get(self);
  
  class Hook{
    /**
     * [constructor description]
     * @param  {Kensho} kensho - instance of Kensho
     * @return {[type]} [description]
     */
    constructor(kensho){
      this.kensho  = kensho;
      this.actions = [];
      this.filters = [];
      
      map.set(this, Object.create(null));
      
      
      let _ = _get(this);
      // console.log(_);
    }
    /**
     * Do hook action
     * @param  {string} name - to do hook name
     * @return {void}
     */
    setAction(name){
      
    }
    /**
     * Do hook filter
     * @param  {string} name - to do hook name
     * @return {*}
     */
    setFilter(name){
      
    }
  }
  Kensho.Hook = Hook;
})();

(()=>{
  let plugin = Object.create(null);
  Kensho.plugin = plugin;
})();

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

(()=>{
  let initialized = false;
  /**
   * 
   */
  Kensho.init = ()=>{
    initialized = true;
  };
  /**
   * 
   * @return {Boolean}
   */
  Kensho.isInitialize = ()=> initialized;
})();

(()=>{
  let rule  = Kensho.rule;

  /**
   * required
   */
  rule.add('required', function(val, param){
    return !val.trim() ? false : true;
  });

})();
