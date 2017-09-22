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
    this.plugin = Kensho.plugin;
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

    // the following types are handled as text type
    switch(type){
      case 'password' :
        type = 'text';
        break;
      case 'search' :
        type = 'text';
        break;
    }

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
   *
   * @method Kensho#hasError
   *
   * @return {Boolean}
   */
  hasError(){
    let _      = this._.get(this);
    let result = false;
    for(let key in _.inputs){
      if(_.inputs[key].error.length !== 0){
        result = true;
        break;
      }
    }
    return result;
  }
  /**
   *
   *
   * 
   * @method Kensho#allValidate
   * 
   * @return {void}
   */
  allValidate(){
    let _ = this._.get(this);
    Object.keys(_.inputs).map((key, i)=>{
      this.validate(key);
    });
  }
  /**
   *
   * 
   * 
   * @method  Kensho#validate
   * @version 0.0.1
   * 
   * @param  {String} name       -
   * @return {kensho} instance
   */
  validate(name){
    let _              = this._.get(this);
    let unit           = _.inputs[name];
    let applyRules     = unit.rule;
    let verbose        = Kensho.config.get('verbose');
    let wrapTag        = Kensho.config.get('errorMessageWrapper');
    let errorClassName = Kensho.config.get('errorClassName');

    if(unit.type === 'text'){
      value = unit.inputElement.value;
    }else{
      value = this.formElement[unit.name] ? this.formElement[unit.name] : value;
    }
    if(unit.type === 'textarea'){
      // console.log();
    }
    
    unit.errorElement.innerHTML = '';
    unit.errorElement.classList.remove(errorClassName);
    unit.error                  = [];

    value = this.hook.filter('pre-validate-value', value, this);

    for(let key in applyRules){
      let result = Kensho.validate.call(this, key, value, applyRules[key].param);
      if(!result){
        let message = document.createTextNode(applyRules[key].errorMessage).nodeValue;
        message = message.replace(/\<+script[\s\S]*\/script[^>]*>/img, '');
        unit.error.push(`<${wrapTag} class="kensho-error-message">${message}</${wrapTag}>`);
        if(!verbose) break;
      }
    }
    if(unit.error.length){
      unit.errorElement.classList.add(errorClassName);
      unit.errorElement.innerHTML = unit.error.join('\n');
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

(()=>{
  let _c = {};
  _c.errorMessageWrapper = 'span';
  _c.verbose             = true;
  _c.errorClassName      = 'kensho-has-error';

  /**
   * Kensho configuration.
   * 
   * @namespace Kensho.config
   */
  Kensho.config = {
    /**
    * get configuration value
    *
    * @method Kensho.config.get
    * 
    * @param {String} key configuration key name
    * @return {*}         key value
    */
    get(key){
      return _c[key];
    },
    /**
     * Set configuration value
     * 
     * @param {(String|Object)} key configuration key name. when you pass an object, you can set a number of configurations in bluk.
     * @return {void}
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
     * @constructs Kensho.Hook
     */
    constructor(){
      // soft private
      map.set(this, Object.create(null));
      let _ = _get(this);
      _.actions = {};
      _.filters = {};
    }
    /**
     * add action/filter hook
     * 
     * @version 0.0.1
     * 
     * @param {string} type         - this hook type name. "action" or "filter"
     * @param {string} hookName     - the target hook name
     * @param {string} callbackName - callback name
     * @param {string} callback     - 
     * @param {number} [priority]   - a priority of to do callback
     * @return {hook}               - instance
     */
    add(type, hookName, callbackName, callback, priority = false){
      let _ = _get(this);
      let hooks;
      switch(type){
        case 'action' :
          hooks = _.actions;
          break;
        case 'filter' :
          hooks = _.filters;
          break;
      }
      if(!hooks[hookName]) hooks[hookName] = [];
      hooks = hooks[hookName];
      
      let newHook = {
        name     : callbackName,
        callback : callback
      }
      if(priority === false){
        hooks.push(newHook);
      }else{
        hooks.splice(priority, 0, newHook);
      }
      return this;
    }
    /**
     * remove action/filter hook
     * 
     * @version 0.0.1
     * 
     * @param  {string} type         - this hook type name. "action" or "filter"
     * @param  {string} hookName     - the target hook name
     * @param  {string} callbackName - callback name
     * @return {hook}                - instance
     */
    remove(type, hookName, callbackName){
      let _ = _get(this);
      let hooks;
      let typeName;
      switch(type){
        case 'action' :
          typeName = 'actions';
          hooks = _.actions;
          break;
        case 'filter' :
          typeName = 'filters';
          break;
      }
      hooks = _[typeName][hookName];
      if(hooks){
        hooks = hooks.filter((hook)=>{
          return hook.name !== callbackName;
        });
        _[typeName][hookName] = hooks;
      }
      return this;
    }
    /**
     * do action hook
     * 
     * @version 0.0.1
     * 
     * @param  {string} name       - hook name
     * @param  {object} [param={}] - in order to pass to the callbacks
     * @param  {*}      thisObject - to bind "this" object. default is Hook instance
     * @return {void}
     */
    action(name, param = {}, thisObject = this){
      let _       = _get(this);
      let actions = _.actions[name];
      if(actions) actions.forEach(listener => listener.callback.call(thisObject, param));
    }
    /**
     * apply filter hook
     * 
     * @version 0.0.1
     * 
     * @param  {string} name       - hook name
     * @param  {*}      data       - data to be filterd
     * @param  {*}      thisObject - to bind "this" object. default is Hook instance
     * @return {*}                 - a filtered data
     */
    filter(name, data, thisObject = this){
      let _       = _get(this);
      let filters = _.filters[name];
      if(filters){
        filters.forEach((listener)=>{
          data = listener.callback.call(thisObject, data);
        });
      };
      return data;
    }
  }
  Kensho.Hook = Hook;
})();

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

(()=>{
  /**
   * @namespace Kensho.plugin
   */
  let plugin = Object.create(null);
  let _list  = {};
  /**
   * add plugin
   *
   * <div class="nonte">
   *   <table>
   *     <thead>
   *       <tr>
   *         <td></td><th>class</th><th>instance</th>
   *       </tr>
   *     </thead>
   *     <tbody>
   *       <tr>
   *         <th>this</th>
   *         <td>Kensho</td>
   *         <td>instance</td>
   *       </tr><tr>
   *         <th>init. function</th>
   *         <td>once. when create first instance</td>
   *         <td>every time create instance</td>
   *       </tr><tr>
   *         <th>to refer by instance</th>
   *         <td>this.classPlugin or Kensho.plugin</td>
   *         <td>this.plugin </td>
   *       </tr>
   *     </tbody>
   *   </table>
   * </div>
   * 
   * @method  Kensho.plugin.add
   * @version 0.0.1
   *
   * @param  {String}   name       plug-in name.
   * @param  {Function} callback   plug-in initialize function.
   * @param  {Object}   [param={}] paramerters in order to pass to the initialize function.
   * @return {void}
   */
  plugin.add = function(name, callback, param = {}){
    if(_list[name]){
      console.error(`plug-in ${name} is conflict`);
      return false;
    }
    if(Kensho.isInitialize()){
      console.error(`plug-in is must be added before create instance.`);
      return false;
    }
    Kensho.plugin[name] = callback;
    // _list[name] = {
    //   param    : param,
    //   callback : callback
    // };
  }
  plugin._list = _list;

  Kensho.plugin = plugin;
})();

(()=>{
  let initialized = false;
  /**
   * initialization
   * 
   * @method  Kensho.init
   * @version 0.0.1
   * 
   * @return {void}
   */
  Kensho.init = ()=>{
    initialized = true;
  };
  /**
   * return true or false whether class initialization was processed.
   * 
   * @method  Kensho.isInitialize
   * @version 0.0.1
   * 
   * @return {Boolean}
   */
  Kensho.isInitialize = ()=> initialized;
})();

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

(()=>{
  let rule  = Kensho.rule;

  /**
   * @param {String} val
   * @param {Object} [param={}]
   */
  rule.add('fullsize', function(val, param = {}){
    let result = true;

    for(let i = 0, l = val.length; i < l; i++){
      if(!Kensho.plugin.is2byte(val[i])){
        result = false;
        break;
      };
    }
    return result;
  });

})();

(()=>{
  let rule  = Kensho.rule;

  /**
   * @param {String} val
   * @param {Object} [param={}]
   */
  rule.add('halfsize', function(val, param = {}){
    let result = true;

    for(let i = 0, l = val.length; i < l; i++){
      if(!Kensho.plugin.is1byte(val[i])){
        result = false;
        break;
      };
    }
    return result;
  });

})();

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

(()=>{
  let rule  = Kensho.rule;

  /**
   * @param {String}  val
   * @param {Object}  [param={}]
   * @param {Boolean} [param.allow2byte=false]
   * @param {Number}  [param.maxAge=125]
   * @param {Boolean} [param.trim=false]
   */
  rule.add('age', function(val, param = {}){
    let maxAge        = param.maxAage             ? param.maxAage : 125;
    let allow2byteFlg = param.allow2byte === true ? true : false;
    let trimFlg       = param.trim       === true ? true : false;

    if(allow2byteFlg) val = Kensho.plugin.full2half(val);
    if(trimFlg) val = val.trim();

    if(!/^[0-9]{1,3}$/.test(val)) return false;          // ex. a1,1234, -5
    if(val.length !== 1 && /^0/.test(val)) return false; // first number is 0
    if(val > maxAge) return false;                       // limit
    return true;
  }, ['number']);

})();

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

(()=>{
  let rule  = Kensho.rule;

  /**
   * @param {String}   val
   * @param {Object}   param
   * @param {String[]} param.list
   */
  rule.add('blacklist', function(val, param){
    if(!param.list) return true;

    for(let i = 0, l = param.list.length; i < l; i++){
      if(val === param.list[i]){
        return false;
        break;
      }
    }
    return true;
  });

})();

(()=>{

  let maps = {};
  maps = Object.assign(maps, {
    '０' : '0', '１' : '1', '２' : '2', '３' : '3', '４' : '4',
    '５' : '5', '６' : '6', '７' : '7', '８' : '8', '９' : '9'
  });
  maps = Object.assign(maps, {
    'ａ' : 'a', 'ｂ' : 'b', 'ｃ' : 'c', 'ｄ' : 'd', 'ｅ' : 'e',
    'ｆ' : 'f', 'ｇ' : 'g', 'ｈ' : 'h', 'ｉ' : 'i', 'ｊ' : 'j',
    'ｋ' : 'k', 'ｌ' : 'l', 'ｍ' : 'm', 'ｎ' : 'n', 'ｏ' : 'o',
    'ｐ' : 'p', 'ｑ' : 'q', 'ｒ' : 'r', 'ｓ' : 's', 'ｔ' : 't',
    'ｕ' : 'u', 'ｖ' : 'v', 'ｗ' : 'w', 'ｘ' : 'x', 'ｙ' : 'y',
    'ｚ' : 'z'
  });
  maps = Object.assign(maps, {
    'Ａ' : 'A', 'Ｂ' : 'B', 'Ｃ' : 'C', 'Ｄ' : 'D', 'Ｅ' : 'E',
    'Ｆ' : 'F', 'Ｇ' : 'G', 'Ｈ' : 'H', 'Ｉ' : 'I', 'Ｊ' : 'J',
    'Ｋ' : 'K', 'Ｌ' : 'L', 'Ｍ' : 'M', 'Ｎ' : 'N', 'Ｏ' : 'O',
    'Ｐ' : 'P', 'Ｑ' : 'Q', 'Ｒ' : 'R', 'Ｓ' : 'S', 'Ｔ' : 'T',
    'Ｕ' : 'U', 'Ｖ' : 'V', 'Ｗ' : 'W', 'Ｘ' : 'X', 'Ｙ' : 'Y',
    'Ｚ' : 'Z'
  });
  maps = Object.assign(maps, {
    '－' : '-', '（' : '(', '）' : ')', '＿' : '_', '／' : '/',
    '＋' : '+', '：' : ':', '；' : ';', '］' : ']', '［' : '[',
    '＠' : '@', '！' : '!', '＜' : '<', '＞' : '>', '？' : '?',
    '｛' : '{', '｝' : '}', '＊' : '*', '”' : '"', '’' : "'",
    '〜' : '~', '＾' : '^', '￥' : '¥', '｜' : '|', '＆' : '&',
    '％' : '%', '＃' : '#', '＄' : '$', '　' : ' ', '＝' : '='
  });
  let full2half = function(val){
    let result = '';
    val.split('').forEach((s)=>{
      s = maps[s] ? maps[s] : s;
      result += s;
    });
    return result;
  }
  full2half.addMap = (userMap)=>{
    maps = Object.assign(maps, userMap);
  }

  Kensho.plugin.add('full2half', full2half);
})();

(()=>{

  isNbyte = function(half){
    return function(val){
      let code = val.charCodeAt(0);
      let f    = (code >= 0x0 && code < 0x81) || (code == 0xf8f0) || (code >= 0xff61 && code < 0xffa0) || (code >= 0xf8f1 && code < 0xf8f4);
      return !(f ^ half);
    }
  }

  Kensho.plugin.add('is1byte', isNbyte(true));

  Kensho.plugin.add('is2byte', isNbyte(false));

})();
