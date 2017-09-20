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

  if(Kensho.instanceList === undefined) Kensho.instanceList = [this];
  else Kensho.instanceList.push(this);

  formElement = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;

  this.formElement = formElement;
  this.rule        = Kensho.rule;
  this.plugin      = Object.create(null);
  this.classPlugin = Kensho.plugin;
  this.hook        = new Kensho.Hook();

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
  _c.verbose             = true; // 

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
  // let _list = {};
  // 
  // Kensho.error = (type)=>{
  //   let lang = Kensho.config.get('lang');
  //   let list = _list[lang] ? _list[lang] : _list['en'];
  //   // if(list && list[type]) console.error(list[type]);
  // }
  // 
  // /**
  //  * @param  
  //  * @return {void}
  //  */
  // Kensho.error.add = ()=>{
  //   
  // }
  // 
  // Kensho.error.add('plugin-error', {
  //   'ja' : '',
  //   'en' : ''
  // });

})();

(()=>{
  let map  = new Map();
  let _get = self => map.get(self);
  
  class Hook{
    /**
     *
     * constructor
     * 
     */
    constructor(){
      // soft private
      map.set(this, Object.create(null));
      let _ = _get(this);
      _.actions = {};
      _.filters = {};
    }
    /**
     *
     * set action/filter hook
     * 
     * @param {string} type       - "action" or "filter"
     * @param {string} hookName   - 
     * @param {string} callback   - 
     * @param {number} [priority] - 
     * @return {hook} this
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
     * 
     * @param  {string} type         - 
     * @param  {string} hookName     - 
     * @param  {string} callbackName - 
     * @return {hook} this
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
     *
     * Do action hook
     * 
     * @param  {string} name       - 
     * @param  {object} [param={}] - 
     * @param  {*}      thisObject - 
     * @return {void}
     */
    action(name, param = {}, thisObject = this){
      let _       = _get(this);
      let actions = _.actions[name];
      if(actions) actions.forEach(listener => listener.callback.call(thisObject, param));
    }
    /**
     * 
     * apply filter hook
     * 
     * @param  {string} name       - 
     * @param  {*}      data       - 
     * @param  {*}      thisObject - 
     * @return {*}
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
      check      : callback,
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

  let error  = Kensho.error;
  let plugin = Object.create(null);
  
  let _list  = {
    'class'    : {},
    'instance' : {}
  }
  /**
   *
   * addPlugin
   * 
   * | scope argument       | class                             | instance                   |
   * |----------------------|-----------------------------------|----------------------------|
   * | this                 | Kensho                            | instance                   |
   * | init. function       | once. when create first instance  | every time create instance |
   * | to refer by instance | this.classPlugin or Kensho.plugin | this.plugin                |
   * 
   * @param {string}   name            - Plugin name
   * @param {function} callback        - Initialize function. Don't use arrow function.
   * @param {object}   [param={}]      - Initialize function arguments
   * @param {string}   [scope='class'] - 'class' or 'instance'
   * 
   * @return {void}
   */
  plugin.add = function(name, callback, param = {}, scope = 'class'){
    if(_list['class'][name] || _list['instance'][name]){
      console.error(`plugin conflict ${name}`);
      return false;
    }
    if(Kensho.isInitialize()){
      console.error(`plug-in is must be added before create instance.`);
      return false;
    }
    _list[scope][name] = {
      param    : param,
      scope    : scope,
      callback : callback
    };
  }
  plugin._list = _list;

  Kensho.plugin = plugin;
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

  /**
   * @param {object} param
   * @param {boolean} param.arrow2byte - 
   */
  rule.add('number', function(val, param = {}){
    let arrow2byte = param['arrow2byte'] ? param['arrow2byte'] : false;
    console.log(this);
    return true;
  });

})();

(()=>{

  /**
   *
   * 
   */
  // Kensho.plugin.add('2to1', function(){
  //   return function(){
  //   }
  // }, {}, 'class');


  // Kensho.plugin.add('test1', function(){
  //   return function(){}
  // }, {}, 'class');

  // Kensho.plugin.add('test2', function(){
  //   console.log(this);
  //   this.hook.add('action', 'init', 'test1', function(){
  //     console.log("init");
  //   });
  //   // let obj = {
  //   //   a : 2
  //   // }
  //   // return function(){
  //   //   
  //   // }
  // }, {}, 'instance');
  // /**
  //  *
  //  * transform 2byte charactor to 1byte charactor.
  //  * 
  //  * @param  {string} val -
  //  * @return {string}
  //  */

  let byte_2to1 = function(val){
  }
  byte_2to1.addMap = (map)=>{
    this._userMaps.push(map);
  }

  Kensho.plugin.add('2to1', function(){
    return byte_2to1
  }, {}, 'class');

  //   let map = {};
  //   map = Object.assign(map, {
  //     '０' : '0', '１' : '1', '２' : '2', '３' : '3', '４' : '4',
  //     '５' : '5', '６' : '6', '７' : '7', '８' : '8', '９' : '9'
  //   });
  //   map = Object.assign(map, {
  //     'ａ' : 'a', 'ｂ' : 'b', 'ｃ' : 'c', 'ｄ' : 'd', 'ｅ' : 'e',
  //     'ｆ' : 'f', 'ｇ' : 'g', 'ｈ' : 'h', 'ｉ' : 'i', 'ｊ' : 'j',
  //     'ｋ' : 'k', 'ｌ' : 'l', 'ｍ' : 'm', 'ｎ' : 'n', 'ｏ' : 'o',
  //     'ｐ' : 'p', 'ｑ' : 'q', 'ｒ' : 'r', 'ｓ' : 's', 'ｔ' : 't',
  //     'ｕ' : 'u', 'ｖ' : 'v', 'ｗ' : 'w', 'ｘ' : 'x', 'ｙ' : 'y',
  //     'ｚ' : 'z'
  //   });
  //   map = Object.assign(map, {
  //     'Ａ' : 'A', 'Ｂ' : 'B', 'Ｃ' : 'C', 'Ｄ' : 'D', 'Ｅ' : 'E',
  //     'Ｆ' : 'F', 'Ｇ' : 'G', 'Ｈ' : 'H', 'Ｉ' : 'I', 'Ｊ' : 'J',
  //     'Ｋ' : 'K', 'Ｌ' : 'L', 'Ｍ' : 'M', 'Ｎ' : 'N', 'Ｏ' : 'O',
  //     'Ｐ' : 'P', 'Ｑ' : 'Q', 'Ｒ' : 'R', 'Ｓ' : 'S', 'Ｔ' : 'T',
  //     'Ｕ' : 'U', 'Ｖ' : 'V', 'Ｗ' : 'W', 'Ｘ' : 'X', 'Ｙ' : 'Y',
  //     'Ｚ' : 'Z'
  //   });
  //   map = Object.assign(map, {
  //     '－' : '-', '（' : '(', '）' : ')', '＿' : '_', '／' : '/',
  //     '＋' : '+', '：' : ':', '；' : ';', '］' : ']', '［' : '[',
  //     '＠' : '@', '！' : '!', '＜' : '<', '＞' : '>', '？' : '?',
  //     '｛' : '{', '｝' : '}', '＊' : '*', '”' : '"', '’' : "'",
  //     '〜' : '~', '＾' : '^', '￥' : '¥', '｜' : '|', '＆' : '&',
  //     '％' : '%', '＃' : '#', '＄' : '$', '　' : ' ', '＝' : '='
  //   });
  //   let result = '';
  //   val.split('').forEach((s)=>{
  //     s = map[s] ? map[s] : s;
  //     result += s;
  //   });
  //   return result;
  // }
  // plugin.byte_2to1._userMaps = [];
  // /**
  //  *
  //  * add user 2byte to 1byte charactors map.
  //  * 
  //  * @param {object} map - The key is 2byte charactor. The value is 1byte charactor.
  //  */
  // plugin.byte_2to1.addMap = (map)=>{
  //   this._userMaps.push(map);
  // }
  // 
  // let plugin = Kensho.plugin;
})();
