/**
 * @class Kensho
 * @namespace Kensho
 */
class Kensho{
  /**
   *
   * 
   * @constructs Kensho
   * @param  {(String|HTMLElement)} formElement
   */
  constructor(formElement){
    if(!Kensho.isInitialize()) Kensho.init();

    if(Kensho.instanceList === undefined) Kensho.instanceList = [this];
    else Kensho.instanceList.push(this);

    formElement = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;

    /**
     * @member {HTMLElement} formElement
     * @memberof Kensho
     * @instance
     */
    this.formElement = formElement;
    /**
     * @member {object} rule
     * @memberof Kensho
     * @instance
     */
    this.rule = Kensho.rule;
    /**
     * @member {object} plugin
     * @memberof Kensho
     * @instance
     */
    this.plugin = Object.create(null);
    /**
     * @member {object} classPlugin
     * @memberof Kensho
     * @instance
     */
    this.classPlugin = Kensho.plugin;
    /**
     * @member {hook} hook
     * @memberof Kensho
     * @instance
     */
    this.hook = new Kensho.Hook();

    // soft private
    this._ = new Map();
    this._.set(this, Object.create(null));
    Object.defineProperty(this, '_', { enumerable : false });
    let _ = this._.get(this);
    _.inputs = {};

    // plugin setup
    if(Kensho.instanceList.length === 1){
      for(let key in Kensho.plugin._list.class){
        let cb    = Kensho.plugin._list.class[key].callback;
        let param = Kensho.plugin._list.class[key].param;
        Kensho.plugin[key] = cb.call(Kensho, param);
      }
    };
    for(let key in Kensho.plugin._list.instance){
      let cb    = Kensho.plugin._list.instance[key].callback;
      let param = Kensho.plugin._list.instance[key].param;
      this.plugin[key] = cb.call(this, param);
    }

    formElement.classList.add('kensho-form');

    this.hook.action('init', {}, this);
  }
  /**
   * add validation field.
   *
   * <div class="note">
   *   <p>
   *     argument event fundamentally sets JavaScript event.type name.<br>
   *     but, it supports especialy names, as follows.
   *   </p>
   *   <dl>
   *     <dt>init</dt>
   *     <dd>when in add() method</dd>
   *   </dl>
   * </div>
   *
   * @method  Kensho#add
   * @version 0.0.1
   * 
   * @param {(String|HTMLElement|HTMLElement[])} inputElement form input HTML element or its CSS selector string.
   * @param {(String|HTMLElement)}               errorElement wrapper element of output error message or its CSS selector string.
   * @param {object}                             rule         the key is rule name. The value is error message.
   * @param {String[]}                           [event=['']] trigger events.
   * @return {kensho}                                         instance
   */
  add(inputElement, errorElement, rule, event = ['']){

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

    let _rule = {};
    for(let key in rule){
      if(typeof rule[key] === 'string'){
        _rule[key] = {
          param        : {},
          errorMessage : rule[key]
        };
      }else{
        _rule[key] = rule[key];
      }
    }
    rule = _rule;

    let unit = {
      name         : name,
      inputElement : inputElement,
      errorElement : errorElement,
      inputTagName : tagName,
      type         : type,
      rule         : rule,
      error        : []
    }

    unit = this.hook.filter('validate-filed', unit, this);
    _.inputs[name] = unit;

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

    this.hook.action('set-validate-field', {unit : unit}, this);
    return this;
  }
  /**
   *
   *
   * @return {Boolean}
   */
  hasError(){
    
  }
  /**
   *
   *
   *
   * 
   */
  allValidate(){
    
  }
  /**
   * [validate description]
   * 
   * @method  Kensho#validate
   * @version 0.0.1
   * 
   * @param  {String} name       -
   * @param  {Object} [param={}] -
   * @return {kensho} instance
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
      let result = Kensho.validate.call(key, value, applyRules[key].param);
    }
    return this;
  }
  /**
   * validate
   * 
   * @method  Kensho.validate
   * @version 0.0.1
   * 
   * @param  {String} name       validation rule name.
   * @param  {*}      value      input value.
   * @param  {Object} [param={}] in order to pass to a rule function.
   * @return {Boolean}           value is valid or invalid
   */
  static validate(name, value, param = {}){
    let rule   = this.rule.get(name);
    let result = true;
    for(let i = 0, l = rule.dependency.length; i < l; i++){
      result = Kensho.rule.get(rule.dependency[i]).check(value, param);
      if(!result) break;
    }
    if(result) result = rule.check(value, param);
    return result;
  }
}
