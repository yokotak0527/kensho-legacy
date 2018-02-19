/**
 * HTMLフォームバリデーションクラス
 *
 * @class Kensho
 */
let Kensho = (()=>{

    let initialized = false;
    let initialize = function(){
        if(initialized) return false;
        initialized = true;

        console.log(this);
    }

    // =========================================================================
    class Kensho{
        /**
         * @arg {(string|HTMLElement)} formElement
         */
        constructor( formElement ) {
            if(Kensho.instanceList === undefined){
                Kensho.instanceList = [this];
                initialize.call(this);
            }else{
                Kensho.instanceList.push( this );
            }

            formElement = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;
            if(formElement === null){
                console.error('form not found.');
                return false;
            }

            this.formElement = formElement;
            this.rule        = Kensho.rule;
            this.plugin      = Kensho.plugin;
            this.hook        = new Kensho.Hook();

            this.inputs = {};

            if(Kensho.config.get('autocomplete'))
                formElement.setAttribute('autocomplete', 'off');

            formElement.classList.add('kensho-form');
        }
        /**
         *  検証対象(input)を追加する
         *
         * @version 0.0.1
         * @memberof Kensho
         * @instance
         *
         * @arg {(string|HTMLElement|HTMLElement[])} inputElement form input HTML element or its CSS selector string.
         * @arg {(string|HTMLElement)}               errorElement wrapper element of output error message or its CSS selector string.
         * @arg {Object}                             rule         the key is rule name. The value is error message.
         * @arg {string|string[]}                    [event=['']] trigger events.
         *
         * @return {kensho}                                         instance
         */
         add(inputElement, errorElement, rule, event = ['']){
            // for example, name attribute of radio buttons are seted same value.
            // querySelector return matched first HTML element and 2nd and subsequent matched element is ignored.
            // so, InputElement not use querySelector but use querySelectorAll.
            // as a result of it, inputElement type is a array.
            inputElement = typeof inputElement === 'string' ? document.querySelectorAll(inputElement) : Array.isArray(inputElement) ? inputElement : [inputElement];
            errorElement = typeof errorElement === 'string' ? document.querySelector(errorElement) : errorElement;
            event        = typeof event        === 'string' ? event.split('|') : event;

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
              case 'tel' :
                type = 'text';
                break;
              case 'email' :
                type = 'text';
                break;
              case 'url' :
                type = 'text';
                break;
              case 'number' :
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

        // console.log(inputElement.getAttribute('type'));
        if(inputElement.getAttribute('type') === 'email'){
          inputElement.addEventListener('change', function(e){
            // e.preventDefault();
            console.log(e);
          });
        }

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
       * @param  {String} name       - name属性
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
        // console.log(value);
        if(unit.type === 'textarea'){
          // console.log();
        }

        unit.errorElement.innerHTML = '';
        unit.errorElement.classList.remove(errorClassName);
        unit.error                  = [];
        // if(Kensho.config.get('validationPseudoClass')) unit.inputElement.setCustomValidity('');
        unit.inputElement.classList.remove('invalid');
        unit.inputElement.classList.remove('valid');

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
          unit.inputElement.classList.add('invalid');
        }else{
          unit.inputElement.classList.add('valid');
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
    return Kensho;
})();

(()=>{
    /**
     * Change the behavior of Kensho.
     *
     * @namespace Kensho.config
     */
    let _c = {};
    _c.errorMessageWrapper = 'span';
    _c.verbose             = true;
    _c.errorClassName      = 'kensho-has-error';
    _c.autocomplete        = true;
    _c.HTML5novalidate     = true;
    // =========================================================================
    Kensho.config = {
        /**
         * get configuration value
         *
         * @version 0.0.1
         *
         * @arg {string} key configuration key name
         *
         * @return {any}
         */
        get(key){
            return _c[key];
        },
        /**
         * Set configuration value
         *
         * @version 0.0.1
         *
         * @arg {(string|Object)} key   A Configuration key name or Configurations key/value Object.<br> When you pass an object, you can set a number of configurations in bluk.
         * @arg {any}             [val] A configuration value.
         *
         * @example Kensho.config({
         *     'errorMessageWrapper' : 'p', // default is 'span'
         * });
         *
         * @return {void}
         */
        set(key, val){
            if(typeof key === 'object') for(let _k in key) this.set(_k, key[_k]);
            _c[key] = val;
        }
    }
})();

(()=>{
    /**
     * Hook class
     *
     * @class Hook
     * @classdesc This class offer action and filter hooks function.<br>And this class not global.
     * @see Kensho#hook
     */
    class Hook{
        constructor(){
            this.actions = {};
            this.filters = {};
        }
        /**
         * Add "action" or "filter" hooks.
         *
         * @version 0.0.1
         * @memberof Hook
         * @instance
         *
         * @arg {string} type          - It hook types. "action" or "filter"
         * @arg {string} hookName      - The target hook name
         * @arg {string} callbackName  - The callback name
         * @arg {string} callback      -
         * @arg {number} [priority=-1] - A priority of to act this callback
         *
         * @return {this}
         */
        add(type, hookName, callbackName, callback, priority = -1){
            let hooks;

            switch(type){
                case 'action' :
                    hooks = this.actions;
                    break;
                case 'filter' :
                    hooks = this.filters;
                    break;
            }

            if(!hooks[hookName]) hooks[hookName] = [];

            let newCallback = {
                name     : callbackName,
                callback : callback
            }
            if(priority < 0){
                hooks[hookName].push(newCallback);
            }else{
                hooks[hookName].splice(priority, 0, newCallback);
            }
            return this;
        }
        /**
         * Remove "action" or "filter" hooks.
         *
         * @version 0.0.1
         * @memberof Hook
         * @instance
         *
         * @param  {string} type         - It hook types. "action" or "filter"
         * @param  {string} hookName     - the target hook name
         * @param  {string} callbackName - callback name
         *
         * @return {this}
         */
        remove(type, hookName, callbackName){
            let hooks;

            switch(type){
                case 'action' :
                    hooks = this.actions;
                    break;
                case 'filter' :
                    hooks = this.filters;
                    break;
            }

            try{
                hooks[hookName] = hooks[hookName].filter((hook)=>{
                    return hook.name !== callbackName;
                });
                if(!hooks[hookName].length) delete hooks[hookName];
            }catch(e){
                console.error(e);
            }
            return this;
        }
        /**
         * Do action hooks.
         *
         * @version 0.0.1
         * @memberof Hook
         * @instance
         *
         * @param  {string} name       - hook name
         * @param  {Object} [param={}] - in order to pass to the callbacks
         * @param  {*}      thisObject - to bind "this" object. default is Hook instance
         *
         * @return {void}
         */
        action(hookName, param = {}, thisObject = this){
            let callbacks = this.actions[hookName];
            if(callbacks) callbacks.forEach(listener => listener.callback.call(thisObject, param));
        }
        /**
         * Apply filter hooks.
         *
         * @version 0.0.1
         * @memberof Hook
         * @instance
         *
         * @param  {string} name       - hook name
         * @param  {*}      data       - data to be filterd
         * @param  {*}      thisObject - to bind "this" object. default is Hook instance
         *
         * @return {*}
         */
        filter(hookName, data, thisObject = this){
            let callbacks = this.filters[hookName];
            if(callbacks){
                callback.forEach((listener)=>{
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
     * @namespace Kensho.rule
     */
    let rule     = Object.create(null);
    let ruleBook = {};

    /**
     * Add validation rule.<br>
     * The Callback takes 2 arguments. A first arugment is input value. second is rule parameters.<br>
     * The callback must return result of validated input value as boolean type.
     *
     * @method Kensho.rule.add
     * @version 0.0.1
     *
     * @param  {string}            name       - validation rule name
     * @param  {Function}          callback   - rule method.
     * @param  {(string|string[])} dependency - other rule that this rule depend on
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
     * Remove validation rule.
     *
     * @method Kensho.rule.remove
     * @version 0.0.1
     *
     * @param  {string} name validation rule name
     * @return {Object}      this
     */
    rule.remove = function(name){
        delete ruleBook[name];
        return this;
    };
    /**
     * return validation rule.
     *
     * @method Kensho.rule.get
     * @version 0.0.1
     *
     * @param  {String} name validation rule name
     * @return {Object}
     */
    rule.get = name => ruleBook[name];

    Kensho.rule = rule;
})();

(()=>{
    /**
     * @namespace Kensho.plugin
     */
    let plugin = Object.create(null);
    let _list  = {};
    /**
     * Add plugins.
     *
     * @method  Kensho.plugin.add
     * @version 0.0.1
     *
     * @param  {string}   name       A plugin name.
     * @param  {Function} callback   A plugin initialize function.
     * @param  {Object}   [param={}] Paramerters in order to pass to the initialize function.
     * @return {void}
     */
    plugin.add = function(name, callback, param = {}){
//     if(Kensho.isInitialize()){
//       console.error(`plug-in is must be added before create instance.`);
//       return false;
//     }
//     Kensho.plugin[name] = callback;
//     // _list[name] = {
//     //   param    : param,
//     //   callback : callback
//     // };
    }
    // plugin._list = _list;

    Kensho.plugin = plugin;
})();

// (()=>{
//   let rule  = Kensho.rule;
//
//   /**
//    * @param {String}  val
//    * @param {Object}  [param={}]
//    * @param {Boolean} [param.trim=false]
//    */
//   Kensho.rule.add('required', function(val, param = {}){
//     let trimFlg = param.trim === true ? true : false;
//
//     if ( val instanceof HTMLElement ) {
//       let tagName = val.tagName.toLowerCase();
//       // checkbox support
//       if( tagName === 'input' && val.getAttribute('type') === 'checkbox' ){
//         return val.checked;
//       }
//     } else {
//         if(trimFlg) val = val.trim();
//
//         return val ? true : false;
//     }
//   });
//
// })();

// (()=>{
//   let rule  = Kensho.rule;
//
//   /**
//    * @param {String} val
//    * @param {Object} [param={}]
//    */
//   rule.add('fullsize', function(val, param = {}){
//     let result = true;
//
//     for(let i = 0, l = val.length; i < l; i++){
//       if(!Kensho.plugin.is2byte(val[i])){
//         result = false;
//         break;
//       };
//     }
//     return result;
//   });
//
// })();

// (()=>{
//   let rule  = Kensho.rule;
//
//   /**
//    * @param {String} val
//    * @param {Object} [param={}]
//    */
//   rule.add('halfsize', function(val, param = {}){
//     let result = true;
//
//     for(let i = 0, l = val.length; i < l; i++){
//       if(!Kensho.plugin.is1byte(val[i])){
//         result = false;
//         break;
//       };
//     }
//     return result;
//   });
//
// })();

// (()=>{
//   let rule  = Kensho.rule;
//
//   /**
//    * @param {String}  val
//    * @param {Object}  [param={}]
//    * @param {Boolean} [param.allow2byte=false]
//    * @param {Boolean} [param.trim=false]
//    */
//   rule.add('number', function(val, param = {}){
//     let allow2byteFlg = param.allow2byte === true ? true : false;
//     let trimFlg       = param.trim       === true ? true : false;
//
//     if(allow2byteFlg) val = Kensho.plugin.full2half(val);
//     if(trimFlg) val = val.trim();
//
//     if(!/^[0-9]*$/.test(val)) return false;
//     return true;
//   });
//
// })();

// (()=>{
//   let rule  = Kensho.rule;
//
//   /**
//    * @param {String}  val
//    * @param {Object}  [param={}]
//    * @param {Boolean} [param.allow2byte=false]
//    * @param {Number}  [param.maxAge=125]
//    * @param {Boolean} [param.trim=false]
//    */
//   rule.add('age', function(val, param = {}){
//     let maxAge        = param.maxAage             ? param.maxAage : 125;
//     let allow2byteFlg = param.allow2byte === true ? true : false;
//     let trimFlg       = param.trim       === true ? true : false;
//
//     if(allow2byteFlg) val = Kensho.plugin.full2half(val);
//     if(trimFlg) val = val.trim();
//
//     if(!/^[0-9]{1,3}$/.test(val)) return false;          // ex. a1,1234, -5
//     if(val.length !== 1 && /^0/.test(val)) return false; // first number is 0
//     if(val > maxAge) return false;                       // limit
//     return true;
//   }, ['number']);
//
// })();

// (()=>{
//   let rule  = Kensho.rule;
//
//   /**
//    * @param {String} val
//    * @param {Object} [param={}]
//    */
//   rule.add('email', function(val, param = {}){
//     // https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
//     let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(val);
//   }, ['halfsize']);
//
// })();

// (()=>{
//   let rule  = Kensho.rule;
//
//   /**
//    * @param {String}   val
//    * @param {Object}   param
//    * @param {String[]} param.list
//    */
//   rule.add('blacklist', function(val, param){
//     let result = true;
//     if(!param.list) return result;
//
//     for(let i = 0, l = param.list.length; i < l; i++){
//       if(val === param.list[i]){
//         result = false;
//         break;
//       }
//     }
//     return result;
//   });
//
// })();

// (()=>{
//   let rule  = Kensho.rule;
//
//   /**
//    * @param {String}   val
//    * @param {Object}   param
//    * @param {String[]} param.list
//    */
//   rule.add('whitelist', function(val, param){
//     let result = false;
//     if(!param.list) return result;
//
//     for(let i = 0, l = param.list.length; i < l; i++){
//       if(val === param.list[i]){
//         result = true;
//         break;
//       }
//     }
//     return result;
//   });
//
// })();

// (()=>{
//   let rule  = Kensho.rule;
//
//   /**
//    * @param {String}   val
//    * @param {Object}   [param]
//    * @param {Number}   [param.min]
//    * @param {Number}   [param.max]
//    * @param {Boolean}  [param.trim=true]
//    * @param {Boolean}  [param.undefinedThrough=false]
//    */
//   rule.add('range', function(val, param = {}){
//     let result           = true;
//     let trimFlg          = param.trim === true ? true : false;
//     let undefinedThrough = param.undefinedThrough === true ? true : false;
//     if(trimFlg) val = val.trim();
//     if ( undefinedThrough && val.length === 0 ) return true;
//
//     if(param.min === undefined && param.max === undefined) return result;
//
//     if(param.min === undefined && typeof param.max === 'number'){
//       if(val.length > param.max) result = false;
//     }
//     if(typeof param.min === 'number' && param.max === undefined){
//       if(val.length < param.min) result = false;
//     }
//     if(param.min !== undefined && param.max !== undefined){
//       if(val.length < param.min || val.length > param.max) result = false;
//     }
//     return result;
//   });
//
// })();

// (()=>{
//   let rule  = Kensho.rule;
//
//   /**
//    * @param {String}       val
//    * @param {String|HTML}  param
//    */
//   rule.add('match', function(val, param){
//     param = typeof param === 'string' ? document.querySelector(param) : param;
//     return param.value === val;
//   });
//
// })();

// (()=>{
//     let maps = {};
//     maps = Object.assign(maps, {
//         '０' : '0', '１' : '1', '２' : '2', '３' : '3', '４' : '4',
//         '５' : '5', '６' : '6', '７' : '7', '８' : '8', '９' : '9'
//     });
//     maps = Object.assign(maps, {
//         'ａ' : 'a', 'ｂ' : 'b', 'ｃ' : 'c', 'ｄ' : 'd', 'ｅ' : 'e',
//         'ｆ' : 'f', 'ｇ' : 'g', 'ｈ' : 'h', 'ｉ' : 'i', 'ｊ' : 'j',
//         'ｋ' : 'k', 'ｌ' : 'l', 'ｍ' : 'm', 'ｎ' : 'n', 'ｏ' : 'o',
//         'ｐ' : 'p', 'ｑ' : 'q', 'ｒ' : 'r', 'ｓ' : 's', 'ｔ' : 't',
//         'ｕ' : 'u', 'ｖ' : 'v', 'ｗ' : 'w', 'ｘ' : 'x', 'ｙ' : 'y',
//         'ｚ' : 'z'
//     });
//     maps = Object.assign(maps, {
//         'Ａ' : 'A', 'Ｂ' : 'B', 'Ｃ' : 'C', 'Ｄ' : 'D', 'Ｅ' : 'E',
//         'Ｆ' : 'F', 'Ｇ' : 'G', 'Ｈ' : 'H', 'Ｉ' : 'I', 'Ｊ' : 'J',
//         'Ｋ' : 'K', 'Ｌ' : 'L', 'Ｍ' : 'M', 'Ｎ' : 'N', 'Ｏ' : 'O',
//         'Ｐ' : 'P', 'Ｑ' : 'Q', 'Ｒ' : 'R', 'Ｓ' : 'S', 'Ｔ' : 'T',
//         'Ｕ' : 'U', 'Ｖ' : 'V', 'Ｗ' : 'W', 'Ｘ' : 'X', 'Ｙ' : 'Y',
//         'Ｚ' : 'Z'
//     });
//     maps = Object.assign(maps, {
//         '－' : '-', '（' : '(', '）' : ')', '＿' : '_', '／' : '/',
//         '＋' : '+', '：' : ':', '；' : ';', '］' : ']', '［' : '[',
//         '＠' : '@', '！' : '!', '＜' : '<', '＞' : '>', '？' : '?',
//         '｛' : '{', '｝' : '}', '＊' : '*', '”' : '"', '’' : "'",
//         '〜' : '~', '＾' : '^', '￥' : '¥', '｜' : '|', '＆' : '&',
//         '％' : '%', '＃' : '#', '＄' : '$', '　' : ' ', '＝' : '='
//     });
//     let full2half = function(val){
//         let result = '';
//         val.split('').forEach((s)=>{
//             s = maps[s] ? maps[s] : s;
//             result += s;
//         });
//         return result;
//     }
//     full2half.addMap = (userMap)=>{
//         maps = Object.assign(maps, userMap);
//     }
//     Kensho.plugin.add('full2half', full2half);
// })();

// (()=>{
//
//   isNbyte = function(half){
//     return function(val){
//       let code = val.charCodeAt(0);
//       let f    = (code >= 0x0 && code < 0x81) || (code == 0xf8f0) || (code >= 0xff61 && code < 0xffa0) || (code >= 0xf8f1 && code < 0xf8f4);
//       return !(f ^ half);
//     }
//   }
//
//   Kensho.plugin.add('is1byte', isNbyte(true));
//
//   Kensho.plugin.add('is2byte', isNbyte(false));
//
// })();

// NodeJS
if(typeof process !== "undefined" && typeof require !== "undefined"){
  module.exports = Kensho;
}
// Browser
else{
  window.Kensho = Kensho;
}
