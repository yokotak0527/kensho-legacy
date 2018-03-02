var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * HTMLフォームバリデーションクラス
 *
 * @class Kensho
 */
var Kensho = function () {

    var initialized = false;

    // =========================================================================

    var Kensho = function () {
        /**
         * @arg {(string|HTMLElement)} formElement
         */
        function Kensho(formElement) {
            _classCallCheck(this, Kensho);

            if (Kensho.instanceList === undefined) {
                Kensho.instanceList = [this];
            } else {
                Kensho.instanceList.push(this);
            }

            formElement = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;
            if (formElement === null) {
                console.error('form not found.');
                return false;
            }

            this.formElement = formElement;
            this.rule = Kensho.rule;
            this.plugin = Kensho.plugin;
            this.hook = new Kensho.Hook();

            this.inputs = {};

            if (Kensho.config.get('autocomplete')) formElement.setAttribute('autocomplete', 'off');

            formElement.classList.add('kensho-form');
        }
        /**
         *  add a validate data unit.
         *
         * @version 0.0.1
         * @memberof Kensho
         * @instance
         *
         * @arg {(string|HTMLElement|HTMLElement[])} inputElement  - form input HTML element or its CSS selector string.
         * @arg {(string|HTMLElement)}               errorElement  - wrapper element of output error message or its CSS selector string.
         * @arg {Object}                             rule          - the key is rule name. The value is error message.
         * @arg {string|string[]}                    [event=['']]  - trigger events.
         * @arg {string}                             [unitName=''] -
         *
         * @return {this}
         */


        Kensho.prototype.add = function add(inputElement, errorElement, rule) {
            var _this = this;

            var event = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [''];
            var unitName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

            // for example, name attribute of radio buttons are seted same value.
            // querySelector return matched first HTML element and 2nd and subsequent matched element is ignored.
            // so, InputElement not use querySelector but use querySelectorAll.
            // as a result of it, inputElement type is a array.
            if (typeof inputElement === 'string') {
                inputElement = this.formElement.querySelectorAll(inputElement);
                inputElement = Array.prototype.map.call(inputElement, function (v) {
                    return v;
                });
            } else if (Array.isArray(inputElement)) {
                var arr = [];
                inputElement.forEach(function (val) {
                    val = typeof val === 'string' ? _this.formElement.querySelectorAll(val) : val;
                    val = Array.prototype.map.call(val, function (v) {
                        return v;
                    });
                    val.forEach(function (v) {
                        arr.push(v);
                    });
                });
                inputElement = arr;
            } else {
                inputElement = Array.prototype.map.call(inputElement, function (v) {
                    return v;
                });
            }

            errorElement = typeof errorElement === 'string' ? this.formElement.querySelector(errorElement) : errorElement;
            event = typeof event === 'string' ? event.split('|') : !event ? [''] : event;

            var name = unitName ? unitName : inputElement[0].getAttribute('name'); // input name attr.
            var tagName = inputElement[0].tagName.toLowerCase(); // tag name
            var type = null; // Input type based on Kensho's own sorting rule
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

            // rule data formatting.
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

            // set data
            var unit = {
                name: name,
                inputElement: inputElement,
                errorElement: errorElement,
                inputTagName: tagName,
                type: type,
                rule: rule,
                error: []
            };

            unit = this.hook.filter('validate-unit', unit);

            this.inputs[name] = unit;

            // Add event handler
            event.forEach(function (name, i) {
                if (name === 'init') {
                    _this.validate(unit.name);
                } else {
                    unit.inputElement.forEach(function (elm) {
                        elm.addEventListener(name, function () {
                            _this.validate(unit.name);
                        });
                    });
                }
            });

            this.hook.action('set-validate-unit', { unit: unit });
            return this;
        };
        /**
         * Return bool value that form has invalid data whether or hasn't.
         *
         * @version 0.0.1
         * @memberof Kensho
         * @instance
         *
         * @arg {string} [name='']
         *
         * @return {boolean}
         */


        Kensho.prototype.hasError = function hasError() {
            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            var result = false;
            if (name) {
                return this.inputs[name].error.length !== 0;
            } else {
                for (var key in this.inputs) {
                    if (this.inputs[key].error.length !== 0) {
                        result = true;
                        break;
                    }
                }
                return result;
            }
        };
        /**
         *
         * @version 0.0.1
         * @memberof Kensho
         * @instance
         *
         * @return {void}
         */


        Kensho.prototype.allValidate = function allValidate() {
            var _this2 = this;

            Object.keys(this.inputs).map(function (key, i) {
                _this2.validate(key);
            });
        };
        /**
         * validate input values
         *
         * @version 0.0.1
         * @memberof Kensho
         * @instance
         *
         * @param  {string} name - name属性
         * @return {kensho}
         */


        Kensho.prototype.validate = function validate(name) {
            var _this3 = this;

            var unit = this.inputs[name];
            var inputElement = unit.inputElement;
            var applyRules = unit.rule;
            var verbose = Kensho.config.get('verbose');
            var wrapTag = Kensho.config.get('errorMessageWrapper');
            var errorClassName = Kensho.config.get('errorClassName');

            // state reset
            unit.errorElement.innerHTML = '';
            unit.errorElement.classList.remove(errorClassName);
            unit.error = [];
            unit.inputElement.forEach(function (elm) {
                elm.classList.remove('invalid');
                elm.classList.remove('valid');
            });

            var _loop = function _loop(ruleName) {
                // validate
                var _val = void 0;
                var values = [];
                var ruleParam = applyRules[ruleName]['param'];
                inputElement.filter(function (elm) {
                    if (unit.type === 'radio') {
                        _val = elm.checked;
                    } else if (unit.type === 'checkbox') {
                        _val = elm.checked;
                    } else {
                        _val = elm.value;
                    }
                    _val = _this3.hook.filter('validate-val--' + unit.type, _val);
                    _val = _this3.hook.filter('validate-val--' + unit.name, _val);
                    values.push(_val);
                });
                var result = Kensho.rule.get(ruleName)(values, ruleParam, unit.type);
                if (!result) {
                    var message = document.createTextNode(applyRules[ruleName].errorMessage).nodeValue;
                    message = message.replace(/\<+script[\s\S]*\/script[^>]*>/img, '');
                    unit.error.push('<' + wrapTag + ' class="kensho-error-message">' + message + '</' + wrapTag + '>');
                    if (!verbose) return 'break';
                }
            };

            for (var ruleName in applyRules) {
                var _ret = _loop(ruleName);

                if (_ret === 'break') break;
            }

            if (unit.error.length) {
                unit.errorElement.classList.add(errorClassName);
                unit.errorElement.innerHTML = unit.error.join('\n');
                unit.inputElement.forEach(function (elm) {
                    elm.classList.add('invalid');
                });
            } else {
                unit.inputElement.forEach(function (elm) {
                    elm.classList.add('valid');
                });
            }
            return this;
        };
        /**
         * static validation.
         *
         * @version 0.0.1
         * @memberof Kensho
         *
         * @param  {string} name       - validation rule name.
         * @param  {any}    value      - input values.
         * @param  {Object} [param={}] - in order to pass to a rule function.
         *
         * @return {boolean}
         */


        Kensho.validate = function validate(name, value) {
            var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            var rule = this.rule.get(name);
            var result = true;
            if (result) result = rule(value, param);
            return result;
        };

        return Kensho;
    }();

    return Kensho;
}();

(function () {
    /**
     * Change the behavior of Kensho.
     *
     * @namespace Kensho.config
     */
    var _c = {};
    _c.errorMessageWrapper = 'span';
    _c.verbose = true;
    _c.errorClassName = 'kensho-has-error';
    _c.autocomplete = true;
    _c.HTML5novalidate = true;
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
        get: function get(key) {
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
        set: function set(key, val) {
            if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object') for (var _k in key) {
                this.set(_k, key[_k]);
            }_c[key] = val;
        }
    };
})();

(function () {
    /**
     * Hook class
     *
     * @class Hook
     * @classdesc This class offer action and filter hooks function.<br>And this class not global.
     * @see Kensho#hook
     */
    var Hook = function () {
        function Hook() {
            _classCallCheck(this, Hook);

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


        Hook.prototype.add = function add(type, hookName, callbackName, callback) {
            var priority = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;

            var hooks = void 0;

            switch (type) {
                case 'action':
                    hooks = this.actions;
                    break;
                case 'filter':
                    hooks = this.filters;
                    break;
            }

            if (!hooks[hookName]) hooks[hookName] = [];

            var newCallback = {
                name: callbackName,
                callback: callback
            };
            if (priority < 0) {
                hooks[hookName].push(newCallback);
            } else {
                hooks[hookName].splice(priority, 0, newCallback);
            }
            return this;
        };
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


        Hook.prototype.remove = function remove(type, hookName, callbackName) {
            var hooks = void 0;

            switch (type) {
                case 'action':
                    hooks = this.actions;
                    break;
                case 'filter':
                    hooks = this.filters;
                    break;
            }

            try {
                hooks[hookName] = hooks[hookName].filter(function (hook) {
                    return hook.name !== callbackName;
                });
                if (!hooks[hookName].length) delete hooks[hookName];
            } catch (e) {
                console.error(e);
            }
            return this;
        };
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


        Hook.prototype.action = function action(hookName) {
            var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var thisObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

            var callbacks = this.actions[hookName];
            if (callbacks) callbacks.forEach(function (listener) {
                return listener.callback.call(thisObject, param);
            });
        };
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


        Hook.prototype.filter = function filter(hookName, data) {
            var thisObject = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

            var callbacks = this.filters[hookName];
            if (callbacks) {
                callbacks.forEach(function (listener) {
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
     * @namespace Kensho.rule
     */
    var rule = Object.create(null);
    var ruleBook = {};

    /**
     * Add validation rule.<br>
     * The Callback takes 2 arguments. A first arugment is input value. second is rule parameters.<br>
     * The callback must return result of validated input value as boolean type.
     *
     * @method Kensho.rule.add
     * @version 0.0.1
     *
     * @param  {string}            name     - validation rule name
     * @param  {Function}          callback - rule method
     * @return {void}
     */
    rule.add = function (name, callback) {
        ruleBook[name] = callback;
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
    rule.remove = function (name) {
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
    var list = {};
    /**
     * Add plugins.<br>
     * You have to call before the Kensho be created a instance.
     * 
     * @method  Kensho.plugin.add
     * @version 1.0.0
     * 
     * @arg {string}   name       - A plugin name.
     * @arg {Function} func       - A plugin function.
     * @arg {Object}   [param={}] - 
     * 
     * @return {this}
     */
    plugin.add = function (name, func) {
        var param = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        list[name] = {
            'name': name,
            'func': func,
            'param': param
        };
        return this;
    };
    /**
     * remove plugins.
     * 
     * @method  Kensho.plugin.remove
     * @version 1.0.0
     * 
     * @arg {string} name - A plugin name.
     * 
     * @return {this}
     */
    plugin.remove = function (name) {
        delete list[name];
        return this;
    };
    /**
     * get plugin function.
     * 
     * @method  Kensho.plugin.get
     * @version 1.0.0
     * 
     * @arg    {string} name - 
     * @return {any}         - 
     */
    plugin.get = function (name) {
        return list[name];
    };

    Kensho.plugin = plugin;
})();

(function () {
    var rule = Kensho.rule;

    /**
     *
     * @arg {(any|any[])} val                -
     * @arg {Object}      [param={}]         -
     * @arg {boolean}     [param.trim=false] -
     * @arg {string}      [type='']          - input type based on Kensho's own sorting rule
     *
     * @return {boolean}
     */
    var requiredFunc = function requiredFunc(val) {
        var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        if (Array.isArray(val)) {
            var result = void 0;
            if (type === 'radio' || type === 'checkbox') {
                result = false;
                val.forEach(function (v) {
                    if (v) result = true;
                });
            } else {
                result = true;
                val.forEach(function (v) {
                    if (!requiredFunc(v, param, type, type)) result = false;
                });
            }
            return result;
        } else {
            var trimFlg = param.trim === true ? true : false;
            if (typeof val === 'boolean') return val;
            if (trimFlg) val = val.trim();
            return val ? true : false;
        }
    };

    Kensho.rule.add('required', requiredFunc);
})();

(function () {
    var rule = Kensho.rule;

    /**
     *
     * @arg {(string|string[])} val                -
     * @arg {Object}            [param={}]         -
     * @arg {boolean}           [param.trim=false] -
     * @arg {boolean}           [param.empty=true] -
     * @arg {string}            [type='']          - input type based on Kensho's own sorting rule
     */
    var fullsizeFunc = function fullsizeFunc(val) {
        var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        if (Array.isArray(val)) {
            var result = true;
            val.forEach(function (v) {
                if (!fullsizeFunc(v, param, type)) result = false;
            });
            return result;
        } else {
            var _result = true;

            var trim = typeof param.trim === 'boolean' ? param.trim : false;
            var empty = typeof param.empty === 'boolean' ? param.empty : true;
            var is2byte = Kensho.plugin.get('is2byte');

            if (trim) val = val.trim();
            if (val.length === 0) return empty ? true : false;

            for (var i = 0, l = val.length; i < l; i++) {
                if (!is2byte.func(val[i])) {
                    _result = false;
                    break;
                };
            }
            return _result;
        }
    };
    rule.add('fullsize', fullsizeFunc);
})();

(function () {
    var rule = Kensho.rule;

    /**
     *
     * @arg {(string|string[])}  val              -
     * @arg {Object}           [param={}]         -
     * @arg {boolean}          [param.trim=false] -
     * @arg {boolean}          [param.empty=true] -
     * @arg {string}           [type='']          - input type based on Kensho's own sorting rule
     *
     * @return {boolean}
     */
    var halfsizeFunc = function halfsizeFunc(val) {
        var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';


        if (Array.isArray(val)) {
            var result = true;
            val.forEach(function (v) {
                if (!halfsizeFunc(v, param, type)) result = false;
            });
            return result;
        } else {
            var _result2 = true;

            var trim = typeof param.trim === 'boolean' ? param.trim : false;
            var empty = typeof param.empty === 'boolean' ? param.empty : true;
            var is1byte = Kensho.plugin.get('is1byte');

            if (trim) val = val.trim();
            if (val.length === 0) return empty ? true : false;

            for (var i = 0, l = val.length; i < l; i++) {
                if (!is1byte.func(val[i])) {
                    _result2 = false;
                    break;
                };
            }
            return _result2;
        }
    };
    rule.add('halfsize', halfsizeFunc);
})();

(function () {
    var rule = Kensho.rule;

    /**
     *
     * @arg {string|string[]} val                      -
     * @arg {Object}          [param={}]               -
     * @arg {boolean}         [param.allow2byte=false] -
     * @arg {boolean}         [param.trim=false]       -
     * @arg {boolean}         [param.empty=true]       -
     * @arg {string}          [type='']                - input type based on Kensho's own sorting rule
     *
     * @return {boolean}
     */
    var numberFunc = function numberFunc(val) {
        var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        if (Array.isArray(val)) {
            var result = true;
            val.forEach(function (v) {
                if (!numberFunc(v, param, type)) result = false;
            });
            return result;
        } else {
            var allow2byteFlg = typeof param.allow2byte === 'boolean' ? param.allow2byte : false;
            var trimFlg = typeof param.trim === 'boolean' ? param.trim : false;
            var empty = typeof param.empty === 'boolean' ? param.empty : true;
            var full2half = Kensho.plugin.get('full2half');

            if (allow2byteFlg) val = full2half.func(val);
            if (trimFlg) val = val.trim();
            if (val.length === 0) return empty ? true : false;

            if (val.length === 0 && empty) return true;

            val *= 1;
            return isNaN(val) ? false : true;
        }
    };
    rule.add('number', numberFunc);
})();

(function () {
    var rule = Kensho.rule;

    /**
     *
     * @arg {(string|string[])} val                      -
     * @arg {Object}            [param={}]               -
     * @arg {number}            [param.maxAge=125]       -
     * @arg {boolean}           [param.allow2byte=false] -
     * @arg {boolean}           [param.trim=false]       -
     * @arg {boolean}           [param.empty=true]       -
     * @arg {string}            [type='']                - input type based on Kensho's own sorting rule
     *
     * @return {boolean}
     */
    var ageFunc = function ageFunc(val) {
        var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        if (Array.isArray(val)) {
            var result = true;
            val.forEach(function (v) {
                if (!ageFunc(v, param, type)) result = false;
            });
            return result;
        } else {
            var maxAge = param.maxAge ? param.maxAge : 125;
            var allow2byteFlg = typeof param.allow2byte === 'boolean' ? param.allow2byte : false;
            var trim = typeof param.trim === 'boolean' ? param.trim : false;
            var empty = typeof param.empty === 'boolean' ? param.empty : true;
            var full2half = Kensho.plugin.get('full2half');

            if (allow2byteFlg) val = full2half.func(val);
            if (trim) val = val.trim();
            if (val.length === 0) return empty ? true : false;

            if (val.length === 0 && empty) return true; // empty
            if (!/^[0-9]+$/.test(val) || /^0/.test(val)) return false;
            if (val > maxAge) return false; // limit
            return true;
        }
    };
    rule.add('age', ageFunc);
})();

(function () {
    var rule = Kensho.rule;

    /**
     *
     * @arg {(string|string[])} val                -
     * @arg {Object}            [param={}]         -
     * @arg {boolean}           [param.trim=false] -
     * @arg {boolean}           [param.empty=true] -
     * @arg {string}            [type='']          - input type based on Kensho's own sorting rule
     *
     * @return {boolean}
     */
    var emailFunc = function emailFunc(val) {
        var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        if (Array.isArray(val)) {
            var result = true;
            val.forEach(function (v) {
                if (!emailFunc(v, param, type)) result = false;
            });
            return result;
        } else {
            var _result3 = true;
            var trim = typeof param.trim === 'boolean' ? param.trim : false;
            var empty = typeof param.empty === 'boolean' ? param.empty : true;
            var halfsizeRule = Kensho.rule.get('halfsize');

            if (trim) val = val.trim();
            if (val.length === 0) return empty ? true : false;

            _result3 = halfsizeRule(val, {}, type);
            if (!_result3) return _result3;

            // https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(val);
        }
    };
    rule.add('email', emailFunc);
})();

(function () {
    var rule = Kensho.rule;

    /**
     *
     * @arg {(string|string[])}     val                -
     * @arg {Object}                [param={}]         -
     * @arg {(string|RegExp|any[])} param.list         -
     * @arg {boolean}               [param.trim=false] -
     * @arg {boolean}               [param.empty=true] -
     * @arg {string}                [type='']          - input type based on Kensho's own sorting rule
     *
     * @return {boolean}
     */
    var blacklistFunc = function blacklistFunc(val, param) {
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        if (Array.isArray(val)) {
            var result = true;
            val.forEach(function (v) {
                if (!blacklistFunc(v, param, type)) result = false;
            });
            return result;
        } else {
            var _result4 = true;
            var trim = typeof param.trim === 'boolean' ? param.trim : false;
            var empty = typeof param.empty === 'boolean' ? param.empty : true;

            if (trim) val = val.trim();
            if (val.length === 0) return empty ? true : false;
            if (!param.list) return true; // do noting

            param.list = Array.isArray(param.list) ? param.list : [param.list];

            for (var i = 0, l = param.list.length; i < l; i++) {
                var reg = void 0;
                if (toString.call(param.list[i]) === '[object RegExp]') {
                    reg = param.list[i];
                } else {
                    reg = new RegExp(param.list[i]);
                }
                if (reg.test(val)) {
                    _result4 = false;
                    break;
                }
            }
            return _result4;
        }
    };
    rule.add('blacklist', blacklistFunc);
})();

(function () {
    var rule = Kensho.rule;

    /**
     *
     * @arg {(string|string[])}     val                -
     * @arg {Object}                [param={}]         -
     * @arg {(string|RegExp|any[])} param.list         -
     * @arg {boolean}               [param.trim=false] -
     * @arg {boolean}               [param.empty=true] -
     *
     * @return {boolean}
     */
    var whitelistFunc = function whitelistFunc(val, param) {
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        if (Array.isArray(val)) {
            var result = true;
            val.forEach(function (v) {
                if (!whitelistFunc(v, param, type)) result = false;
            });
            return result;
        } else {
            var _result5 = false;
            var trim = typeof param.trim === 'boolean' ? param.trim : false;
            var empty = typeof param.empty === 'boolean' ? param.empty : true;

            if (trim) val = val.trim();
            if (val.length === 0) return empty ? true : false;
            if (!param.list) return true; // do noting

            param.list = Array.isArray(param.list) ? param.list : [param.list];

            for (var i = 0, l = param.list.length; i < l; i++) {
                var reg = void 0;
                if (toString.call(param.list[i]) === '[object RegExp]') {
                    reg = param.list[i];
                } else {
                    reg = new RegExp(param.list[i]);
                }
                if (reg.test(val)) {
                    _result5 = true;
                    break;
                }
            }
            return _result5;
        }
    };
    rule.add('whitelist', whitelistFunc);
})();

(function () {
    var rule = Kensho.rule;

    /**
     * @param {(string|string[])} val                   -
     * @param {Object}            [param]               -
     * @param {number}            [param.min=undefined] -
     * @param {number}            [param.max=undefined] -
     * @param {boolean}           [param.trim=true]     -
     * @param {boolean}           [param.empty=true]    -
     * @param {boolean}           [type='']             - input type based on Kensho's own sorting rule
     *
     * @return {boolean}
     */
    var rangeFunc = function rangeFunc(val) {
        var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        if (Array.isArray(val)) {
            var result = true;
            val.forEach(function (v) {
                if (!rangeFunc(v, param, type)) result = false;
            });
            return result;
        } else {
            var _result6 = true;

            var trim = typeof param.trim === 'boolean' ? param.trim : false;
            var empty = typeof param.empty === 'boolean' ? param.empty : true;

            if (trim) val = val.trim();
            if (val.length === 0) return empty ? true : false;

            if (param.min === undefined && param.max === undefined) return true;

            if (param.min === undefined && typeof param.max === 'number') {
                if (val.length > param.max) _result6 = false;
            }
            if (typeof param.min === 'number' && param.max === undefined) {
                if (val.length < param.min) _result6 = false;
            }
            if (param.min !== undefined && param.max !== undefined) {
                if (val.length < param.min || val.length > param.max) _result6 = false;
            }
            return _result6;
        }
    };
    rule.add('range', rangeFunc);
})();

(function () {
    var rule = Kensho.rule;

    /**
     *
     * @arg {(string|string[])}           val                -
     * @arg {(string|HTMLElement|Object)} [param={}]         ~
     * @arg {boolean}                     [param.empty=true] -
     * @arg {string}                      [param.val='']     - fixed value
     * @arg {string}                      [type='']          - input type based on Kensho's own sorting rule
     *
     * @return {boolean}
     */
    var matchFunc = function matchFunc(val) {
        var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        var empty = typeof param.empty === 'boolean' ? param.empty : true;

        if (Array.isArray(val)) {
            var arr = val;
            var v = param.val ? param.val : arr[0];
            var filtered = arr.filter(function (_v) {
                return v === _v;
            });

            if (arr.length === filtered.length) {
                if (!filtered[0].length) return empty;
                return true;
            } else {
                return false;
            }
        } else {
            // do noting
            if (!param.val) return true;

            if (!val.length) return empty;
            return val === param.val ? true : false;
        }
    };
    rule.add('match', matchFunc);
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

    var isNbyte = function isNbyte(half) {
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
