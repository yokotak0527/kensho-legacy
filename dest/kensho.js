var _this2 = this;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Kensho
 * @namespace Kensho
 */
var Kensho = function () {
  /**
   *
   * 
   * @constructs Kensho
   * @param  {(String|HTMLElement)} formElement
   */
  function Kensho(formElement) {
    _classCallCheck(this, Kensho);

    if (!Kensho.isInitialize()) Kensho.init();

    if (Kensho.instanceList === undefined) Kensho.instanceList = [this];else Kensho.instanceList.push(this);

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
    Object.defineProperty(this, '_', { enumerable: false });
    var _ = this._.get(this);
    _.inputs = {};

    // plugin setup
    if (Kensho.instanceList.length === 1) {
      for (var key in Kensho.plugin._list.class) {
        var cb = Kensho.plugin._list.class[key].callback;
        var param = Kensho.plugin._list.class[key].param;
        Kensho.plugin[key] = cb.call(Kensho, param);
      }
    };
    for (var _key in Kensho.plugin._list.instance) {
      var _cb = Kensho.plugin._list.instance[_key].callback;
      var _param = Kensho.plugin._list.instance[_key].param;
      this.plugin[_key] = _cb.call(this, _param);
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


  Kensho.prototype.add = function add(inputElement, errorElement, rule) {
    var _this = this;

    var event = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [''];


    // for example, name attribute of radio buttons are seted same value.
    // querySelector return matched first HTML element and 2nd and subsequent matched element is ignored.
    // so, InputElement not use querySelector but use querySelectorAll.
    // as a result of it, inputElement type is a array.
    inputElement = typeof inputElement === 'string' ? document.querySelectorAll(inputElement) : Array.isArray(inputElement) ? inputElement : [inputElement];
    errorElement = typeof errorElement === 'string' ? document.querySelector(errorElement) : errorElement;
    event = typeof event === 'string' ? [event] : event;

    var _ = this._.get(this);
    var name = inputElement[0].getAttribute('name');
    var tagName = inputElement[0].tagName.toLowerCase();
    var type = null;
    if (tagName === 'input') type = inputElement[0].getAttribute('type');else type = tagName;
    if (type !== 'radio') inputElement = inputElement[0];

    var _rule = {};
    for (var key in rule) {
      if (typeof rule[key] === 'string') {
        _rule[key] = {
          param: {},
          errorMessage: rule[key]
        };
      } else {
        _rule[key] = rule[key];
      }
    }
    rule = _rule;

    var unit = {
      name: name,
      inputElement: inputElement,
      errorElement: errorElement,
      inputTagName: tagName,
      type: type,
      rule: rule,
      error: []
    };

    unit = this.hook.filter('validate-filed', unit, this);
    _.inputs[name] = unit;

    // Add event handler
    event.forEach(function (name, i) {
      if (name === 'init') {
        if (unit.type === 'radio') {
          unit.inputElement.forEach(function (input, i) {
            _this.validate(unit.name);
          });
        } else {
          _this.validate(unit.name);
        }
      } else {
        if (unit.type === 'radio') {
          unit.inputElement.forEach(function (input, i) {
            input.addEventListener(name, function () {
              _this.validate(unit.name);
            });
          });
        } else {
          unit.inputElement.addEventListener(name, function () {
            _this.validate(unit.name);
          });
        }
      }
    });

    this.hook.action('set-validate-field', { unit: unit }, this);
    return this;
  };
  /**
   *
   *
   * @return {Boolean}
   */


  Kensho.prototype.hasError = function hasError() {};
  /**
   *
   *
   *
   * 
   */


  Kensho.prototype.allValidate = function allValidate() {};
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


  Kensho.prototype.validate = function validate(name) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ = this._.get(this);
    var unit = _.inputs[name];
    var applyRules = unit.rule;
    var verbose = Kensho.config.get('verbose');

    if (unit.type === 'text') {
      value = unit.inputElement.value;
    } else {
      value = this.formElement[unit.name] ? this.formElement[unit.name] : value;
    }
    if (unit.type === 'textarea') {
      // console.log();
    }

    unit.errorElement.innerHTML = '';
    unit.error = [];

    value = this.hook.filter('pre-validate-value', value, this);

    for (var key in applyRules) {
      var result = Kensho.validate(key, value, applyRules[key].param);
    }
    return this;
  };
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


  Kensho.validate = function validate(name, value) {
    var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var rule = this.rule.get(name);
    var result = true;
    for (var i = 0, l = rule.dependency.length; i < l; i++) {
      result = Kensho.rule.get(rule.dependency[i]).check(value, param);
      if (!result) break;
    }
    if (result) result = rule.check(value, param);
    return result;
  };

  return Kensho;
}();

(function () {
  var _c = {};
  _c.errorMessageWrapper = 'li';
  _c.verbose = true;

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
    get: function get(key) {
      return _c[key];
    },

    /**
     * Set configuration value
     * 
     * @param {(String|Object)} key configuration key name. when you pass an object, you can set a number of configurations in bluk.
     * @return {void}
     */
    set: function set(key, val) {
      if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') for (var _k in key) {
        this.set(_k, key[_k]);
      }_c[key] = val;
    }
  };
})();

(function () {
  var map = new Map();
  var _get = function _get(self) {
    return map.get(self);
  };

  var Hook = function () {
    /**
     * @constructs Kensho.Hook
     */
    function Hook() {
      _classCallCheck(this, Hook);

      // soft private
      map.set(this, Object.create(null));
      var _ = _get(this);
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


    Hook.prototype.add = function add(type, hookName, callbackName, callback) {
      var priority = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      var _ = _get(this);
      var hooks = void 0;
      switch (type) {
        case 'action':
          hooks = _.actions;
          break;
        case 'filter':
          hooks = _.filters;
          break;
      }
      if (!hooks[hookName]) hooks[hookName] = [];
      hooks = hooks[hookName];

      var newHook = {
        name: callbackName,
        callback: callback
      };
      if (priority === false) {
        hooks.push(newHook);
      } else {
        hooks.splice(priority, 0, newHook);
      }
      return this;
    };
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


    Hook.prototype.remove = function remove(type, hookName, callbackName) {
      var _ = _get(this);
      var hooks = void 0;
      var typeName = void 0;
      switch (type) {
        case 'action':
          typeName = 'actions';
          hooks = _.actions;
          break;
        case 'filter':
          typeName = 'filters';
          break;
      }
      hooks = _[typeName][hookName];
      if (hooks) {
        hooks = hooks.filter(function (hook) {
          return hook.name !== callbackName;
        });
        _[typeName][hookName] = hooks;
      }
      return this;
    };
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


    Hook.prototype.action = function action(name) {
      var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var thisObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

      var _ = _get(this);
      var actions = _.actions[name];
      if (actions) actions.forEach(function (listener) {
        return listener.callback.call(thisObject, param);
      });
    };
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


    Hook.prototype.filter = function filter(name, data) {
      var thisObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

      var _ = _get(this);
      var filters = _.filters[name];
      if (filters) {
        filters.forEach(function (listener) {
          data = listener.callback.call(thisObject, data);
        });
      };
      return data;
    };

    return Hook;
  }();

  Kensho.Hook = Hook;
})();

(function () {
  /**
   * validation rules
   * 
   * @namespace Kensho.rule
   */
  var rule = Object.create(null);

  var ruleBook = {};

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
  rule.add = function (name, callback) {
    var dependency = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    dependency = typeof dependency === 'string' ? [dependency] : dependency;
    ruleBook[name] = {
      check: callback,
      dependency: dependency
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
  rule.remove = function (name) {
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
  rule.get = function (name) {
    return ruleBook[name];
  };

  Kensho.rule = rule;
})();

(function () {
  /**
   * @namespace Kensho.plugin
   */
  var plugin = Object.create(null);
  var _list = {
    'class': {},
    'instance': {}
  };
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
   * @param  {String}   name            plug-in name.
   * @param  {Function} callback        plug-in initialize function.
   * @param  {Object}   [param={}]      paramerters in order to pass to the initialize function.
   * @param  {String}   [scope='class'] plugin type 'class' or 'instance'
   * @return {void}
   */
  plugin.add = function (name, callback) {
    var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var scope = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'class';

    if (_list['class'][name] || _list['instance'][name]) {
      console.error('plug-in ' + name + ' is conflict');
      return false;
    }
    if (Kensho.isInitialize()) {
      console.error('plug-in is must be added before create instance.');
      return false;
    }
    _list[scope][name] = {
      param: param,
      scope: scope,
      callback: callback
    };
  };
  plugin._list = _list;

  Kensho.plugin = plugin;
})();

(function () {
  var initialized = false;
  /**
   * initialization
   * 
   * @method  Kensho.init
   * @version 0.0.1
   * 
   * @return {void}
   */
  Kensho.init = function () {
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
  Kensho.isInitialize = function () {
    return initialized;
  };
})();

(function () {
  var rule = Kensho.rule;

  /**
   * required
   */
  rule.add('required', function (val, param) {
    return !val.trim() ? false : true;
  });

  /**
   *
   * @param {Object} param
   * @param {Boolean} param.allow2byte - 
   */
  rule.add('number', function (val) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var allow2byte = param['allow2byte'] ? param['allow2byte'] : false;
    console.log(this);
    return false;
  });

  rule.add('test', function (val) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // let rule   = Kensho.rule.get('test');
    var result = true;
    // for(let i = 0, l = rule.length; i < l; i++){
    //   result = Kensho.rule.get(rule.length[i]).check(val, param);
    //   if(!result) break;
    // }
    // if(result) result = rule.check(val, param);
    return result;
  }, 'number');
})();

(function () {

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

  var byte_2to1 = function byte_2to1(val) {};
  byte_2to1.addMap = function (map) {
    _this2._userMaps.push(map);
  };

  Kensho.plugin.add('2to1', function () {
    return byte_2to1;
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
//# sourceMappingURL=kensho.js.map
