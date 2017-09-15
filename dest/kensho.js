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
    formElement = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;

    this.formElement = formElement;
    this.rule = Kensho.rule;
    // this.plugin      = Kensho.plugin;
    this.hook = new Kensho.Hook();
    // this.plugin

    // soft private
    this._ = new Map();
    this._.set(this, Object.create(null));
    Object.defineProperty(this, '_', { enumerable: false });
    var _ = this._.get(this);
    _.inputs = {};

    // console.log(form instanceof HTMLElement);
    formElement.classList.add('kensho-form');

    // this.hook.add('action', 'init', 'test1', function(){
    //   console.log("1");
    // });
    // this.hook.add('action', 'init', 'test2', function(){
    //   console.log("2");
    // }).remove('action', 'init', 'test2');
    // 
    // this.hook.action('init', function(){
    //   console.log(this);
    // }, {}, this);
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

    var unit = {
      name: name,
      inputElement: inputElement,
      errorElement: errorElement,
      inputTagName: tagName,
      type: type,
      rule: rule,
      error: []
    };

    unit = this.hook.filter('add-validate-filed-set-data', unit, this);
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

    this.hook.action('add-validate-field', { unit: unit }, this);
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

    return rule.callback(value, param);
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

    console.log("member");
    var _ = this._.get(this);
    var unit = _.inputs[name];

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
  var plugin = Object.create(null);
  Kensho.plugin = plugin;
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
      callback: callback,
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
})();
//# sourceMappingURL=kensho.js.map
