/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./core/Kensho.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./core/Kensho.Hook.js":
/*!*****************************!*\
  !*** ./core/Kensho.Hook.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/**\n * Hook class\n *\n * @class Hook\n * @classdesc This class offer action and filter hooks function.<br>And this class not global.\n * @see Kensho#hook\n */\nvar Hook = function () {\n    function Hook() {\n        _classCallCheck(this, Hook);\n\n        this.actions = {};\n        this.filters = {};\n    }\n    /**\n     * Add \"action\" or \"filter\" hooks.\n     *\n     * @version 0.0.1\n     * @memberof Hook\n     * @instance\n     *\n     * @arg {string} type          - It hook types. \"action\" or \"filter\"\n     * @arg {string} hookName      - The target hook name\n     * @arg {string} callbackName  - The callback name\n     * @arg {string} callback      -\n     * @arg {number} [priority=-1] - A priority of to act this callback\n     *\n     * @return {this}\n     */\n\n\n    _createClass(Hook, [{\n        key: 'add',\n        value: function add(type, hookName, callbackName, callback) {\n            var priority = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;\n\n            var hooks = void 0;\n\n            switch (type) {\n                case 'action':\n                    hooks = this.actions;\n                    break;\n                case 'filter':\n                    hooks = this.filters;\n                    break;\n            }\n\n            if (!hooks[hookName]) hooks[hookName] = [];\n\n            var newCallback = {\n                name: callbackName,\n                callback: callback\n            };\n            if (priority < 0) {\n                hooks[hookName].push(newCallback);\n            } else {\n                hooks[hookName].splice(priority, 0, newCallback);\n            }\n            return this;\n        }\n        /**\n         * Remove \"action\" or \"filter\" hooks.\n         *\n         * @version 0.0.1\n         * @memberof Hook\n         * @instance\n         *\n         * @param  {string} type         - It hook types. \"action\" or \"filter\"\n         * @param  {string} hookName     - the target hook name\n         * @param  {string} callbackName - callback name\n         *\n         * @return {this}\n         */\n\n    }, {\n        key: 'remove',\n        value: function remove(type, hookName, callbackName) {\n            var hooks = void 0;\n\n            switch (type) {\n                case 'action':\n                    hooks = this.actions;\n                    break;\n                case 'filter':\n                    hooks = this.filters;\n                    break;\n            }\n\n            try {\n                hooks[hookName] = hooks[hookName].filter(function (hook) {\n                    return hook.name !== callbackName;\n                });\n                if (!hooks[hookName].length) delete hooks[hookName];\n            } catch (e) {\n                console.error(e);\n            }\n            return this;\n        }\n        /**\n         * Do action hooks.\n         *\n         * @version 0.0.1\n         * @memberof Hook\n         * @instance\n         *\n         * @param  {string} name       - hook name\n         * @param  {Object} [param={}] - in order to pass to the callbacks\n         * @param  {*}      thisObject - to bind \"this\" object. default is Hook instance\n         *\n         * @return {void}\n         */\n\n    }, {\n        key: 'action',\n        value: function action(hookName) {\n            var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n            var thisObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;\n\n            var callbacks = this.actions[hookName];\n            if (callbacks) callbacks.forEach(function (listener) {\n                return listener.callback.call(thisObject, param);\n            });\n        }\n        /**\n         * Apply filter hooks.\n         *\n         * @version 0.0.1\n         * @memberof Hook\n         * @instance\n         *\n         * @param  {string} name       - hook name\n         * @param  {*}      data       - data to be filterd\n         * @param  {*}      thisObject - to bind \"this\" object. default is Hook instance\n         *\n         * @return {*}\n         */\n\n    }, {\n        key: 'filter',\n        value: function filter(hookName, data) {\n            var thisObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;\n\n            var callbacks = this.filters[hookName];\n            if (callbacks) {\n                callbacks.forEach(function (listener) {\n                    data = listener.callback.call(thisObject, data);\n                });\n            };\n            return data;\n        }\n    }]);\n\n    return Hook;\n}();\n\nexports.default = Hook;\n\n//# sourceURL=webpack:///./core/Kensho.Hook.js?");

/***/ }),

/***/ "./core/Kensho.config.js":
/*!*******************************!*\
  !*** ./core/Kensho.config.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n/**\n * Change the behavior of Kensho.\n *\n * @namespace Kensho.config\n */\nvar _c = {};\n_c.errorMessageWrapper = 'span';\n_c.verbose = true;\n_c.errorClassName = 'kensho-has-error';\n_c.autocomplete = true;\n_c.HTML5novalidate = true;\n// =============================================================================\nexports.default = {\n  /**\n   * get configuration value\n   *\n   * @version 0.0.1\n   *\n   * @arg {string} key configuration key name\n   *\n   * @return {any}\n   */\n  get: function get(key) {\n    return _c[key];\n  },\n\n  /**\n   * Set configuration value\n   *\n   * @version 0.0.1\n   *\n   * @arg {(string|Object)} key   A Configuration key name or Configurations key/value Object.<br> When you pass an object, you can set a number of configurations in bluk.\n   * @arg {any}             [val] A configuration value.\n   *\n   * @example Kensho.config({\n   *     'errorMessageWrapper' : 'p', // default is 'span'\n   * });\n   *\n   * @return {void}\n   */\n  set: function set(key, val) {\n    if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') for (var _k in key) {\n      this.set(_k, key[_k]);\n    }_c[key] = val;\n  }\n};\n\n//# sourceURL=webpack:///./core/Kensho.config.js?");

/***/ }),

/***/ "./core/Kensho.js":
/*!************************!*\
  !*** ./core/Kensho.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _KenshoConfig = __webpack_require__(/*! core/Kensho.config.js */ \"./core/Kensho.config.js\");\n\nvar _KenshoConfig2 = _interopRequireDefault(_KenshoConfig);\n\nvar _KenshoHook = __webpack_require__(/*! core/Kensho.Hook.js */ \"./core/Kensho.Hook.js\");\n\nvar _KenshoHook2 = _interopRequireDefault(_KenshoHook);\n\nvar _KenshoRule = __webpack_require__(/*! core/Kensho.rule.js */ \"./core/Kensho.rule.js\");\n\nvar _KenshoRule2 = _interopRequireDefault(_KenshoRule);\n\nvar _KenshoPlugin = __webpack_require__(/*! core/Kensho.plugin.js */ \"./core/Kensho.plugin.js\");\n\nvar _KenshoPlugin2 = _interopRequireDefault(_KenshoPlugin);\n\nvar _required = __webpack_require__(/*! rule/required.js */ \"./rule/required.js\");\n\nvar _required2 = _interopRequireDefault(_required);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/**\n * HTMLフォームバリデーションクラス\n *\n * @class Kensho\n */\nvar initialized = false;\n\n// =============================================================================\n\nvar Kensho = function () {\n    /**\n     * @arg {(string|HTMLElement)} formElement\n     */\n    function Kensho(formElement) {\n        _classCallCheck(this, Kensho);\n\n        if (Kensho.instanceList === undefined) {\n            Kensho.instanceList = [this];\n        } else {\n            Kensho.instanceList.push(this);\n        }\n\n        formElement = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;\n        if (formElement === null) {\n            console.error('form not found.');\n            return false;\n        }\n\n        this.formElement = formElement;\n        this.rule = Kensho.rule;\n        this.plugin = Kensho.plugin;\n        this.hook = new Kensho.Hook();\n\n        this.inputs = {};\n\n        if (Kensho.config.get('autocomplete')) formElement.setAttribute('autocomplete', 'off');\n\n        formElement.classList.add('kensho-form');\n    }\n    /**\n     *  add a validate data unit.\n     *\n     * @version 0.0.1\n     * @memberof Kensho\n     * @instance\n     *\n     * @arg {(string|HTMLElement|HTMLElement[])} inputElement  - form input HTML element or its CSS selector string.\n     * @arg {(string|HTMLElement)}               errorElement  - wrapper element of output error message or its CSS selector string.\n     * @arg {Object}                             rule          - the key is rule name. The value is error message.\n     * @arg {string|string[]}                    [event=['']]  - trigger events.\n     * @arg {string}                             [unitName=''] -\n     *\n     * @return {this}\n     */\n\n\n    _createClass(Kensho, [{\n        key: 'add',\n        value: function add(inputElement, errorElement, rule) {\n            var _this = this;\n\n            var event = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [''];\n            var unitName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';\n\n            // for example, name attribute of radio buttons are seted same value.\n            // querySelector return matched first HTML element and 2nd and subsequent matched element is ignored.\n            // so, InputElement not use querySelector but use querySelectorAll.\n            // as a result of it, inputElement type is a array.\n            if (typeof inputElement === 'string') {\n                inputElement = this.formElement.querySelectorAll(inputElement);\n                inputElement = Array.prototype.map.call(inputElement, function (v) {\n                    return v;\n                });\n            } else if (Array.isArray(inputElement)) {\n                var arr = [];\n                inputElement.forEach(function (val) {\n                    val = typeof val === 'string' ? _this.formElement.querySelectorAll(val) : val;\n                    val = Array.prototype.map.call(val, function (v) {\n                        return v;\n                    });\n                    val.forEach(function (v) {\n                        arr.push(v);\n                    });\n                });\n                inputElement = arr;\n            } else {\n                inputElement = Array.prototype.map.call(inputElement, function (v) {\n                    return v;\n                });\n            }\n\n            errorElement = typeof errorElement === 'string' ? this.formElement.querySelector(errorElement) : errorElement;\n            event = typeof event === 'string' ? event.split('|') : !event ? [''] : event;\n\n            var name = unitName ? unitName : inputElement[0].getAttribute('name'); // input name attr.\n            var tagName = inputElement[0].tagName.toLowerCase(); // tag name\n            var type = null; // Input type based on Kensho's own sorting rule\n            if (tagName === 'input') type = inputElement[0].getAttribute('type');else type = tagName;\n\n            // the following types are handled as text type\n            switch (type) {\n                case 'password':\n                    type = 'text';\n                    break;\n                case 'search':\n                    type = 'text';\n                    break;\n                case 'tel':\n                    type = 'text';\n                    break;\n                case 'email':\n                    type = 'text';\n                    break;\n                case 'url':\n                    type = 'text';\n                    break;\n                case 'number':\n                    type = 'text';\n                    break;\n            }\n\n            // rule data formatting.\n            var _rule = {};\n            for (var key in rule) {\n                if (typeof rule[key] === 'string') {\n                    _rule[key] = {\n                        param: {},\n                        errorMessage: rule[key]\n                    };\n                } else {\n                    _rule[key] = rule[key];\n                }\n            }\n            rule = _rule;\n\n            // set data\n            var unit = {\n                name: name,\n                inputElement: inputElement,\n                errorElement: errorElement,\n                inputTagName: tagName,\n                type: type,\n                rule: rule,\n                error: []\n            };\n\n            unit = this.hook.filter('validate-unit', unit);\n\n            this.inputs[name] = unit;\n\n            // Add event handler\n            event.forEach(function (name, i) {\n                if (name === 'init') {\n                    _this.validate(unit.name);\n                } else {\n                    unit.inputElement.forEach(function (elm) {\n                        elm.addEventListener(name, function () {\n                            _this.validate(unit.name);\n                        });\n                    });\n                }\n            });\n\n            this.hook.action('set-validate-unit', { unit: unit });\n            return this;\n        }\n        /**\n         * Return bool value that form has invalid data whether or hasn't.\n         *\n         * @version 0.0.1\n         * @memberof Kensho\n         * @instance\n         *\n         * @arg {string} [name='']\n         *\n         * @return {boolean}\n         */\n\n    }, {\n        key: 'hasError',\n        value: function hasError() {\n            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';\n\n            var result = false;\n            if (name) {\n                return this.inputs[name].error.length !== 0;\n            } else {\n                for (var key in this.inputs) {\n                    if (this.inputs[key].error.length !== 0) {\n                        result = true;\n                        break;\n                    }\n                }\n                return result;\n            }\n        }\n        /**\n         *\n         * @version 0.0.1\n         * @memberof Kensho\n         * @instance\n         *\n         * @return {void}\n         */\n\n    }, {\n        key: 'allValidate',\n        value: function allValidate() {\n            var _this2 = this;\n\n            Object.keys(this.inputs).map(function (key, i) {\n                _this2.validate(key);\n            });\n        }\n        /**\n         * validate input values\n         *\n         * @version 0.0.1\n         * @memberof Kensho\n         * @instance\n         *\n         * @param  {string} name - name属性\n         * @return {kensho}\n         */\n\n    }, {\n        key: 'validate',\n        value: function validate(name) {\n            var _this3 = this;\n\n            var unit = this.inputs[name];\n            var inputElement = unit.inputElement;\n            var applyRules = unit.rule;\n            var verbose = Kensho.config.get('verbose');\n            var wrapTag = Kensho.config.get('errorMessageWrapper');\n            var errorClassName = Kensho.config.get('errorClassName');\n\n            // state reset\n            unit.errorElement.innerHTML = '';\n            unit.errorElement.classList.remove(errorClassName);\n            unit.error = [];\n            unit.inputElement.forEach(function (elm) {\n                elm.classList.remove('invalid');\n                elm.classList.remove('valid');\n            });\n\n            var _loop = function _loop(ruleName) {\n                // validate\n                var _val = void 0;\n                var values = [];\n                var ruleParam = applyRules[ruleName]['param'];\n                inputElement.filter(function (elm) {\n                    if (unit.type === 'radio') {\n                        _val = elm.checked;\n                    } else if (unit.type === 'checkbox') {\n                        _val = elm.checked;\n                    } else {\n                        _val = elm.value;\n                    }\n                    _val = _this3.hook.filter('validate-val--' + unit.type, _val);\n                    _val = _this3.hook.filter('validate-val--' + unit.name, _val);\n                    values.push(_val);\n                });\n                var result = Kensho.rule.get(ruleName)(values, ruleParam, unit.type);\n                if (!result) {\n                    var message = document.createTextNode(applyRules[ruleName].errorMessage).nodeValue;\n                    message = message.replace(/\\<+script[\\s\\S]*\\/script[^>]*>/img, '');\n                    unit.error.push('<' + wrapTag + ' class=\"kensho-error-message\">' + message + '</' + wrapTag + '>');\n                    if (!verbose) return 'break';\n                }\n            };\n\n            for (var ruleName in applyRules) {\n                var _ret = _loop(ruleName);\n\n                if (_ret === 'break') break;\n            }\n\n            if (unit.error.length) {\n                unit.errorElement.classList.add(errorClassName);\n                unit.errorElement.innerHTML = unit.error.join('\\n');\n                unit.inputElement.forEach(function (elm) {\n                    elm.classList.add('invalid');\n                });\n            } else {\n                unit.inputElement.forEach(function (elm) {\n                    elm.classList.add('valid');\n                });\n            }\n            return this;\n        }\n        /**\n         * static validation.\n         *\n         * @version 0.0.1\n         * @memberof Kensho\n         *\n         * @param  {string} name       - validation rule name.\n         * @param  {any}    value      - input values.\n         * @param  {Object} [param={}] - in order to pass to a rule function.\n         *\n         * @return {boolean}\n         */\n\n    }], [{\n        key: 'validate',\n        value: function validate(name, value) {\n            var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};\n\n            var rule = this.rule.get(name);\n            var result = true;\n            if (result) result = rule(value, param);\n            return result;\n        }\n    }]);\n\n    return Kensho;\n}();\n\nKensho.config = _KenshoConfig2.default;\nKensho.Hook = _KenshoHook2.default;\nKensho.rule = _KenshoRule2.default;\nKensho.plugin = _KenshoPlugin2.default;\n\n(0, _required2.default)(Kensho);\n\nif (window) window.Kensho = Kensho;\n\nexports.default = Kensho;\n\n//# sourceURL=webpack:///./core/Kensho.js?");

/***/ }),

/***/ "./core/Kensho.plugin.js":
/*!*******************************!*\
  !*** ./core/Kensho.plugin.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n/**\n * @namespace Kensho.plugin\n */\nvar plugin = Object.create(null);\nvar list = {};\n/**\n * Add plugins.<br>\n * You have to call before the Kensho be created a instance.\n *\n * @method  Kensho.plugin.add\n * @version 1.0.0\n *\n * @arg {string}   name       - A plugin name.\n * @arg {Function} func       - A plugin function.\n * @arg {Object}   [param={}] -\n *\n * @return {this}\n */\nplugin.add = function (name, func) {\n  var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};\n\n  list[name] = {\n    'name': name,\n    'func': func,\n    'param': param\n  };\n  return this;\n};\n/**\n * remove plugins.\n *\n * @method  Kensho.plugin.remove\n * @version 1.0.0\n *\n * @arg {string} name - A plugin name.\n *\n * @return {this}\n */\nplugin.remove = function (name) {\n  delete list[name];\n  return this;\n};\n/**\n * get plugin function.\n *\n * @method  Kensho.plugin.get\n * @version 1.0.0\n *\n * @arg    {string} name -\n * @return {any}         -\n */\nplugin.get = function (name) {\n  return list[name];\n};\n\nexports.default = plugin;\n\n//# sourceURL=webpack:///./core/Kensho.plugin.js?");

/***/ }),

/***/ "./core/Kensho.rule.js":
/*!*****************************!*\
  !*** ./core/Kensho.rule.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n/**\n * @namespace Kensho.rule\n */\nvar rule = Object.create(null);\nvar ruleBook = {};\n\n/**\n * Add validation rule.<br>\n * The Callback takes 2 arguments. A first arugment is input value. second is rule parameters.<br>\n * The callback must return result of validated input value as boolean type.\n *\n * @method Kensho.rule.add\n * @version 0.0.1\n *\n * @param  {string}            name     - validation rule name\n * @param  {Function}          callback - rule method\n * @return {void}\n */\nrule.add = function (name, callback) {\n  ruleBook[name] = callback;\n};\n/**\n * Remove validation rule.\n *\n * @method Kensho.rule.remove\n * @version 0.0.1\n *\n * @param  {string} name validation rule name\n * @return {Object}      this\n */\nrule.remove = function (name) {\n  delete ruleBook[name];\n  return this;\n};\n/**\n * return validation rule.\n *\n * @method Kensho.rule.get\n * @version 0.0.1\n *\n * @param  {String} name validation rule name\n * @return {Object}\n */\nrule.get = function (name) {\n  return ruleBook[name];\n};\n\nexports.default = rule;\n\n//# sourceURL=webpack:///./core/Kensho.rule.js?");

/***/ }),

/***/ "./rule/required.js":
/*!**************************!*\
  !*** ./rule/required.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nexports.default = function (Kensho) {\n    var rule = Kensho.rule;\n\n    /**\n     *\n     * @arg {(any|any[])} val                -\n     * @arg {Object}      [param={}]         -\n     * @arg {boolean}     [param.trim=false] -\n     * @arg {string}      [type='']          - input type based on Kensho's own sorting rule\n     *\n     * @return {boolean}\n     */\n    var requiredFunc = function requiredFunc(val) {\n        var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';\n\n        if (Array.isArray(val)) {\n            var result = void 0;\n            if (type === 'radio' || type === 'checkbox') {\n                result = false;\n                val.forEach(function (v) {\n                    if (v) result = true;\n                });\n            } else {\n                result = true;\n                val.forEach(function (v) {\n                    if (!requiredFunc(v, param, type, type)) result = false;\n                });\n            }\n            return result;\n        } else {\n            var trimFlg = param.trim === true ? true : false;\n            if (typeof val === 'boolean') return val;\n            if (trimFlg) val = val.trim();\n            return val ? true : false;\n        }\n    };\n\n    Kensho.rule.add('required', requiredFunc);\n};\n\n//# sourceURL=webpack:///./rule/required.js?");

/***/ })

/******/ });