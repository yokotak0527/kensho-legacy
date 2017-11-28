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
    Object.defineProperty(this, '_', { enumerable: false });
    var _ = this._.get(this);
    _.inputs = {};

    // if(Kensho.config.get('HTML5novalidate'))
    //   formElement.setAttribute('novalidate', 'novalidate');
    if (Kensho.config.get('autocomplete')) formElement.setAttribute('autocomplete', 'off');

    formElement.classList.add('kensho-form');

    this.hook.action('init', {}, this);

    // parser
    var parserList = formElement.querySelectorAll('*[data-k-name]');
    if (parserList) {
      parserList = Array.from(parserList);
      parserList = parserList.filter(function (html, i) {
        return !html.getAttribute('data-k-name').match(/\-\-err$/) ? true : false;
      });
      parserList.map(function (html, i) {
        var data = Kensho.parser.parse(formElement, html);
      });
    }
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
   * @param {String|String[]}                    [event=['']] trigger events.
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
    event = typeof event === 'string' ? event.split('|') : event;

    var _ = this._.get(this);
    var name = inputElement[0].getAttribute('name');
    var tagName = inputElement[0].tagName.toLowerCase();
    var type = null;
    if (tagName === 'input') type = inputElement[0].getAttribute('type');else type = tagName;

    // the following types are handled as text type
    switch (type) {
      case 'password':
        type = 'text';
        break;
      case 'search':
        type = 'text';
        break;
      case 'tel':
        type = 'text';
        break;
      case 'email':
        type = 'text';
        break;
      case 'url':
        type = 'text';
        break;
      case 'number':
        type = 'text';
        break;
    }

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

    // console.log(inputElement.getAttribute('type'));
    if (inputElement.getAttribute('type') === 'email') {
      inputElement.addEventListener('change', function (e) {
        // e.preventDefault();
        console.log(e);
      });
    }

    this.hook.action('set-validate-field', { unit: unit }, this);
    return this;
  };
  /**
   *
   *
   *
   * @method Kensho#hasError
   *
   * @return {Boolean}
   */


  Kensho.prototype.hasError = function hasError() {
    var _ = this._.get(this);
    var result = false;
    for (var key in _.inputs) {
      if (_.inputs[key].error.length !== 0) {
        result = true;
        break;
      }
    }
    return result;
  };
  /**
   *
   *
   *
   * @method Kensho#allValidate
   *
   * @return {void}
   */


  Kensho.prototype.allValidate = function allValidate() {
    var _this2 = this;

    var _ = this._.get(this);
    Object.keys(_.inputs).map(function (key, i) {
      _this2.validate(key);
    });
  };
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


  Kensho.prototype.validate = function validate(name) {
    var _ = this._.get(this);
    var unit = _.inputs[name];
    var applyRules = unit.rule;
    var verbose = Kensho.config.get('verbose');
    var wrapTag = Kensho.config.get('errorMessageWrapper');
    var errorClassName = Kensho.config.get('errorClassName');

    if (unit.type === 'text') {
      value = unit.inputElement.value;
    } else {
      value = this.formElement[unit.name] ? this.formElement[unit.name] : value;
    }
    // console.log(value);
    if (unit.type === 'textarea') {
      // console.log();
    }

    unit.errorElement.innerHTML = '';
    unit.errorElement.classList.remove(errorClassName);
    unit.error = [];
    // if(Kensho.config.get('validationPseudoClass')) unit.inputElement.setCustomValidity('');
    unit.inputElement.classList.remove('invalid');
    unit.inputElement.classList.remove('valid');

    value = this.hook.filter('pre-validate-value', value, this);

    for (var key in applyRules) {
      var result = Kensho.validate.call(this, key, value, applyRules[key].param);
      if (!result) {
        var message = document.createTextNode(applyRules[key].errorMessage).nodeValue;
        message = message.replace(/\<+script[\s\S]*\/script[^>]*>/img, '');
        unit.error.push('<' + wrapTag + ' class="kensho-error-message">' + message + '</' + wrapTag + '>');
        if (!verbose) break;
      }
    }
    if (unit.error.length) {
      unit.errorElement.classList.add(errorClassName);
      unit.errorElement.innerHTML = unit.error.join('\n');
      unit.inputElement.classList.add('invalid');
    } else {
      unit.inputElement.classList.add('valid');
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
  _c.errorMessageWrapper = 'span';
  _c.verbose = true;
  _c.errorClassName = 'kensho-has-error';
  _c.autocomplete = true;
  _c.HTML5novalidate = true;

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

  var parser = {};
  parser.parse = function (formElement, inputElement) {
    console.log(formElement);
    return true;
  };

  Kensho.parser = parser;
})();

(function () {
  /**
   * @namespace Kensho.plugin
   */
  var plugin = Object.create(null);
  var _list = {};
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
  plugin.add = function (name, callback) {
    var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (_list[name]) {
      console.error('plug-in ' + name + ' is conflict');
      return false;
    }
    if (Kensho.isInitialize()) {
      console.error('plug-in is must be added before create instance.');
      return false;
    }
    Kensho.plugin[name] = callback;
    // _list[name] = {
    //   param    : param,
    //   callback : callback
    // };
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
   * @param {String}  val
   * @param {Object}  [param={}]
   * @param {Boolean} [param.trim=false]
   */
  Kensho.rule.add('required', function (val) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var trimFlg = param.trim === true ? true : false;

    if (val instanceof HTMLElement) {
      var tagName = val.tagName.toLowerCase();
      // checkbox support
      if (tagName === 'input' && val.getAttribute('type') === 'checkbox') {
        return val.checked;
      }
    } else {
      if (trimFlg) val = val.trim();

      return val ? true : false;
    }
  });
})();

(function () {
  var rule = Kensho.rule;

  /**
   * @param {String} val
   * @param {Object} [param={}]
   */
  rule.add('fullsize', function (val) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var result = true;

    for (var i = 0, l = val.length; i < l; i++) {
      if (!Kensho.plugin.is2byte(val[i])) {
        result = false;
        break;
      };
    }
    return result;
  });
})();

(function () {
  var rule = Kensho.rule;

  /**
   * @param {String} val
   * @param {Object} [param={}]
   */
  rule.add('halfsize', function (val) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var result = true;

    for (var i = 0, l = val.length; i < l; i++) {
      if (!Kensho.plugin.is1byte(val[i])) {
        result = false;
        break;
      };
    }
    return result;
  });
})();

(function () {
  var rule = Kensho.rule;

  /**
   * @param {String}  val
   * @param {Object}  [param={}]
   * @param {Boolean} [param.allow2byte=false]
   * @param {Boolean} [param.trim=false]
   */
  rule.add('number', function (val) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var allow2byteFlg = param.allow2byte === true ? true : false;
    var trimFlg = param.trim === true ? true : false;

    if (allow2byteFlg) val = Kensho.plugin.full2half(val);
    if (trimFlg) val = val.trim();

    if (!/^[0-9]*$/.test(val)) return false;
    return true;
  });
})();

(function () {
  var rule = Kensho.rule;

  /**
   * @param {String}  val
   * @param {Object}  [param={}]
   * @param {Boolean} [param.allow2byte=false]
   * @param {Number}  [param.maxAge=125]
   * @param {Boolean} [param.trim=false]
   */
  rule.add('age', function (val) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var maxAge = param.maxAage ? param.maxAage : 125;
    var allow2byteFlg = param.allow2byte === true ? true : false;
    var trimFlg = param.trim === true ? true : false;

    if (allow2byteFlg) val = Kensho.plugin.full2half(val);
    if (trimFlg) val = val.trim();

    if (!/^[0-9]{1,3}$/.test(val)) return false; // ex. a1,1234, -5
    if (val.length !== 1 && /^0/.test(val)) return false; // first number is 0
    if (val > maxAge) return false; // limit
    return true;
  }, ['number']);
})();

(function () {
  var rule = Kensho.rule;

  /**
   * @param {String} val
   * @param {Object} [param={}]
   */
  rule.add('email', function (val) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    // https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val);
  }, ['halfsize']);
})();

(function () {
  var rule = Kensho.rule;

  /**
   * @param {String}   val
   * @param {Object}   param
   * @param {String[]} param.list
   */
  rule.add('blacklist', function (val, param) {
    var result = true;
    if (!param.list) return result;

    for (var i = 0, l = param.list.length; i < l; i++) {
      if (val === param.list[i]) {
        result = false;
        break;
      }
    }
    return result;
  });
})();

(function () {
  var rule = Kensho.rule;

  /**
   * @param {String}   val
   * @param {Object}   param
   * @param {String[]} param.list
   */
  rule.add('whitelist', function (val, param) {
    var result = false;
    if (!param.list) return result;

    for (var i = 0, l = param.list.length; i < l; i++) {
      if (val === param.list[i]) {
        result = true;
        break;
      }
    }
    return result;
  });
})();

(function () {
  var rule = Kensho.rule;

  /**
   * @param {String}   val
   * @param {Object}   [param]
   * @param {Number}   [param.min]
   * @param {Number}   [param.max]
   * @param {Boolean}  [param.trim=true]
   */
  rule.add('range', function (val) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var result = true;
    var trimFlg = param.trim === true ? true : false;
    if (trimFlg) val = val.trim();

    if (param.min === undefined && param.max === undefined) return result;

    if (param.min === undefined && typeof param.max === 'number') {
      if (val.length > param.max) result = false;
    }
    if (typeof param.min === 'number' && param.max === undefined) {
      if (val.length < param.min) result = false;
    }
    if (param.min !== undefined && param.max !== undefined) {
      if (val.length < param.min || val.length > param.max) result = false;
    }
    return result;
  });
})();

(function () {
  var rule = Kensho.rule;

  /**
   * @param {String}       val
   * @param {String|HTML}  param
   */
  rule.add('match', function (val, param) {
    param = typeof param === 'string' ? document.querySelector(param) : param;
    return param.value === val;
  });
})();

(function () {

  var maps = {};
  maps = Object.assign(maps, {
    '０': '0', '１': '1', '２': '2', '３': '3', '４': '4',
    '５': '5', '６': '6', '７': '7', '８': '8', '９': '9'
  });
  maps = Object.assign(maps, {
    'ａ': 'a', 'ｂ': 'b', 'ｃ': 'c', 'ｄ': 'd', 'ｅ': 'e',
    'ｆ': 'f', 'ｇ': 'g', 'ｈ': 'h', 'ｉ': 'i', 'ｊ': 'j',
    'ｋ': 'k', 'ｌ': 'l', 'ｍ': 'm', 'ｎ': 'n', 'ｏ': 'o',
    'ｐ': 'p', 'ｑ': 'q', 'ｒ': 'r', 'ｓ': 's', 'ｔ': 't',
    'ｕ': 'u', 'ｖ': 'v', 'ｗ': 'w', 'ｘ': 'x', 'ｙ': 'y',
    'ｚ': 'z'
  });
  maps = Object.assign(maps, {
    'Ａ': 'A', 'Ｂ': 'B', 'Ｃ': 'C', 'Ｄ': 'D', 'Ｅ': 'E',
    'Ｆ': 'F', 'Ｇ': 'G', 'Ｈ': 'H', 'Ｉ': 'I', 'Ｊ': 'J',
    'Ｋ': 'K', 'Ｌ': 'L', 'Ｍ': 'M', 'Ｎ': 'N', 'Ｏ': 'O',
    'Ｐ': 'P', 'Ｑ': 'Q', 'Ｒ': 'R', 'Ｓ': 'S', 'Ｔ': 'T',
    'Ｕ': 'U', 'Ｖ': 'V', 'Ｗ': 'W', 'Ｘ': 'X', 'Ｙ': 'Y',
    'Ｚ': 'Z'
  });
  maps = Object.assign(maps, {
    '－': '-', '（': '(', '）': ')', '＿': '_', '／': '/',
    '＋': '+', '：': ':', '；': ';', '］': ']', '［': '[',
    '＠': '@', '！': '!', '＜': '<', '＞': '>', '？': '?',
    '｛': '{', '｝': '}', '＊': '*', '”': '"', '’': "'",
    '〜': '~', '＾': '^', '￥': '¥', '｜': '|', '＆': '&',
    '％': '%', '＃': '#', '＄': '$', '　': ' ', '＝': '='
  });
  var full2half = function full2half(val) {
    var result = '';
    val.split('').forEach(function (s) {
      s = maps[s] ? maps[s] : s;
      result += s;
    });
    return result;
  };
  full2half.addMap = function (userMap) {
    maps = Object.assign(maps, userMap);
  };

  Kensho.plugin.add('full2half', full2half);
})();

(function () {

  isNbyte = function isNbyte(half) {
    return function (val) {
      var code = val.charCodeAt(0);
      var f = code >= 0x0 && code < 0x81 || code == 0xf8f0 || code >= 0xff61 && code < 0xffa0 || code >= 0xf8f1 && code < 0xf8f4;
      return !(f ^ half);
    };
  };

  Kensho.plugin.add('is1byte', isNbyte(true));

  Kensho.plugin.add('is2byte', isNbyte(false));
})();

// NodeJS
if (typeof process !== "undefined" && typeof require !== "undefined") {
  module.exports = Kensho;
}
// Browser
else {
    window.Kensho = Kensho;
  }
//# sourceMappingURL=kensho.js.map
