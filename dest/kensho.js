var _this2 = this;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Kensho = function () {

  /**
   *
   * @param  {string|HTMLElement} formElement             - 
   * @param  {object}             [option={}]             - 
   * @param  {string}             [option.errorWrap=span] - 
   * @return {Kensho}
   */
  function Kensho(formElement) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Kensho);

    if (Kensho.isInitialize) Kensho.init();

    if (Kensho.instanceList === undefined) Kensho.instanceList = [this];else Kensho.instanceList.push(this);

    formElement = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;

    this.formElement = formElement;
    this.rule = Kensho.rule;
    this.plugin = Object.create(null);
    this.classPlugin = Kensho.plugin;
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


  Kensho.prototype.add = function add(inputElement, errorElement, rule) {
    var _this = this;

    var event = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [''];
    var param = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};


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
   * validate value
   * 
   * @param  {string}     name  - validation rule name.
   * @param  {string|int} value - 
   * @param  {object}     param - key/value variables for callback
   * @return {boolean}
   */


  Kensho.validate = function validate(name, value) {
    var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var rule = this.rule.get(name);
    return rule.check(value, param);
  };

  /**
   *
   *
   * @name   {string}
   * @name   {param}
   * @return {kensho} this
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
    // for(let i = 0, l = rule.length; i < l; i++){
    //   
    // }
    // console.log(value);


    return this;
  };

  return Kensho;
}();

(function () {
  var _c = {};
  // ===========================================================================
  // 
  // DEFAULT CONFIGURATIONS.
  // 
  // ===========================================================================
  _c.lang = 'en'; // language
  _c.errorMessageWrapper = 'li';
  _c.verbose = true; // 

  Kensho.config = {
    /**
     * get configuration value
     * 
     * @param  {string} key - Configuration key name
     * @return {*}
     */
    get: function get(key) {
      return _c[key];
    },

    /**
     * Set configuration value
     * 
     * @param {string|obj} key - Configuration key name or Object.
     * @param void
     */
    set: function set(key, val) {
      if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') for (var _k in key) {
        this.set(_k, key[_k]);
      }_c[key] = val;
    }
  };
})();

(function () {
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

(function () {
  var map = new Map();
  var _get = function _get(self) {
    return map.get(self);
  };

  var Hook = function () {
    /**
     *
     * constructor
     * 
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
     *
     * set action/filter hook
     * 
     * @param {string} type       - "action" or "filter"
     * @param {string} hookName   - 
     * @param {string} callback   - 
     * @param {number} [priority] - 
     * @return {hook} this
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
     * 
     * @param  {string} type         - 
     * @param  {string} hookName     - 
     * @param  {string} callbackName - 
     * @return {hook} this
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
     *
     * Do action hook
     * 
     * @param  {string} name       - 
     * @param  {object} [param={}] - 
     * @param  {*}      thisObject - 
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
     * 
     * apply filter hook
     * 
     * @param  {string} name       - 
     * @param  {*}      data       - 
     * @param  {*}      thisObject - 
     * @return {*}
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
  var ruleBook = {};
  var rule = Object.create(null);

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
  rule.add = function (name, callback) {
    var dependency = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    dependency = typeof dependency === 'string' ? [dependency] : dependency;
    ruleBook[name] = {
      check: callback,
      dependency: dependency
    };
  };

  /**
   * 
   * remove validation rule.
   *
   * @parm   {string} name - 
   * @return {object} this
   */
  rule.remove = function (name) {
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
  rule.get = function (name) {
    return ruleBook[name];
  };

  Kensho.rule = rule;
})();

(function () {

  var error = Kensho.error;
  var plugin = Object.create(null);

  var _list = {
    'class': {},
    'instance': {}
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
  };plugin.add = function (name, callback) {
    var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var scope = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'class';

    if (_list['class'][name] || _list['instance'][name]) {
      console.error('plugin conflict ' + name);
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
   * 
   */
  Kensho.init = function () {
    initialized = true;
  };
  /**
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
   * @param {object} param
   * @param {boolean} param.arrow2byte - 
   */
  rule.add('number', function (val) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var arrow2byte = param['arrow2byte'] ? param['arrow2byte'] : false;
    console.log(this);
    return true;
  });
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
