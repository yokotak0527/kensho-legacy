/**
 * HTMLフォームバリデーションクラス
 *
 * @class Kensho
 */
let Kensho = (()=>{

    let initialized = false;

    // =========================================================================
    class Kensho{
        /**
         * @arg {(string|HTMLElement)} formElement
         */
        constructor( formElement ) {
            if(Kensho.instanceList === undefined){
                Kensho.instanceList = [this];
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
        add(inputElement, errorElement, rule, event = [''], unitName = ''){
            // for example, name attribute of radio buttons are seted same value.
            // querySelector return matched first HTML element and 2nd and subsequent matched element is ignored.
            // so, InputElement not use querySelector but use querySelectorAll.
            // as a result of it, inputElement type is a array.
            if( typeof inputElement === 'string' ){
                inputElement = this.formElement.querySelectorAll(inputElement);
                inputElement = Array.prototype.map.call(inputElement, v => v );
            }else if( Array.isArray(inputElement) ){
                let arr = [];
                inputElement.forEach( val => {
                    val = typeof val === 'string' ? this.formElement.querySelectorAll(val) : val;
                    val = Array.prototype.map.call(val, v => v );
                    val.forEach( v => { arr.push(v) });
                });
                inputElement = arr;
            }else{
                inputElement = Array.prototype.map.call(inputElement, v => v );
            }

            errorElement = typeof errorElement === 'string' ? this.formElement.querySelector(errorElement)    : errorElement;
            event        = typeof event        === 'string' ? event.split('|') : !event ? [''] : event;

            let name    = unitName ? unitName : inputElement[0].getAttribute('name');  // input name attr.
            let tagName = inputElement[0].tagName.toLowerCase(); // tag name
            let type    = null;                                  // Input type based on Kensho's own sorting rule
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

            // rule data formatting.
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

            // set data
            let unit = {
                name         : name,
                inputElement : inputElement,
                errorElement : errorElement,
                inputTagName : tagName,
                type         : type,
                rule         : rule,
                error        : []
            }

            unit = this.hook.filter('validate-unit', unit);

            this.inputs[name] = unit;

            // Add event handler
            event.forEach((name, i)=>{
                if(name === 'init'){
                    this.validate(unit.name);
                }else{
                    unit.inputElement.forEach((elm)=>{
                        elm.addEventListener(name, ()=>{
                            this.validate(unit.name);
                        });
                    });
                }
            });

            this.hook.action('set-validate-unit', {unit : unit});
            return this;
        }
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
        hasError(name = ''){
            let result = false;
            if ( name ) {
                return this.inputs[name].error.length !== 0;
            } else {
                for(let key in this.inputs){
                    if(this.inputs[key].error.length !== 0){
                        result = true;
                        break;
                    }
                }
                return result;
            }
        }
        /**
         *
         * @version 0.0.1
         * @memberof Kensho
         * @instance
         *
         * @return {void}
         */
        allValidate(){
            Object.keys(this.inputs).map((key, i)=>{
                this.validate(key);
            });
        }
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
        validate(name){
            let unit           = this.inputs[name];
            let inputElement   = unit.inputElement;
            let applyRules     = unit.rule;
            let verbose        = Kensho.config.get('verbose');
            let wrapTag        = Kensho.config.get('errorMessageWrapper');
            let errorClassName = Kensho.config.get('errorClassName');

            // state reset
            unit.errorElement.innerHTML = '';
            unit.errorElement.classList.remove(errorClassName);
            unit.error = [];
            unit.inputElement.forEach( elm => {
                elm.classList.remove('invalid');
                elm.classList.remove('valid');
            });

            for(let ruleName in applyRules){
                // validate
                let _val;
                let values    = [];
                let ruleParam = applyRules[ruleName]['param'];
                inputElement.filter( elm => {
                    if( unit.type === 'radio' ){
                        _val = elm.checked;
                    }else if( unit.type === 'checkbox' ){
                        _val = elm.checked;
                    }else{
                        _val = elm.value;
                    }
                    _val = this.hook.filter(`validate-val--${unit.type}`, _val);
                    _val = this.hook.filter(`validate-val--${unit.name}`, _val);
                    values.push(_val);
                });
                let result = Kensho.rule.get(ruleName)(values, ruleParam, unit.type);
                if(!result){
                    let message = document.createTextNode(applyRules[ruleName].errorMessage).nodeValue;
                    message = message.replace(/\<+script[\s\S]*\/script[^>]*>/img, '');
                    unit.error.push(`<${wrapTag} class="kensho-error-message">${message}</${wrapTag}>`);
                    if(!verbose) break;
                }
            }

            if(unit.error.length){
                unit.errorElement.classList.add(errorClassName);
                unit.errorElement.innerHTML = unit.error.join('\n');
                unit.inputElement.forEach( elm => { elm.classList.add('invalid') });
            }else{
                unit.inputElement.forEach( elm => { elm.classList.add('valid') });
            }
            return this;
        }
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
        static validate(name, value, param = {}){
            let rule = this.rule.get(name);
            let result = true;
            if(result) result = rule(value, param);
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
                callbacks.forEach((listener)=>{
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
     * @param  {string}            name     - validation rule name
     * @param  {Function}          callback - rule method
     * @return {void}
     */
    rule.add = function(name, callback){
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
    let list   = {};
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
    plugin.add = function(name, func, param = {}){
        list[name] = {
            'name'  : name,
            'func'  : func,
            'param' : param
        };
        return this;
    }
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
    plugin.remove = function(name){
        delete list[name];
        return this;
    }
    /**
     * get plugin function.
     * 
     * @method  Kensho.plugin.get
     * @version 1.0.0
     * 
     * @arg    {string} name - 
     * @return {any}         - 
     */
    plugin.get = function(name){
        return list[name];
    }

    Kensho.plugin = plugin;
})();

(()=>{
    let rule  = Kensho.rule;

    /**
     *
     * @arg {(any|any[])} val                -
     * @arg {Object}      [param={}]         -
     * @arg {boolean}     [param.trim=false] -
     * @arg {string}      [type='']          - input type based on Kensho's own sorting rule
     *
     * @return {boolean}
     */
    let requiredFunc = function(val, param = {}, type = ''){
        if(Array.isArray(val)){
            let result;
            if(type === 'radio' || type === 'checkbox'){
                result = false;
                val.forEach( v => { if(v) result = true } );
            }else{
                result = true;
                val.forEach( v =>{
                    if(!requiredFunc(v, param, type, type)) result = false;
                });
            }
            return result;
        }else{
            let trimFlg = param.trim === true ? true : false;
            if(typeof val === 'boolean') return val;
            if(trimFlg) val = val.trim();
            return val ? true : false;
        }
    }

    Kensho.rule.add('required', requiredFunc);

})();

(()=>{
    let rule  = Kensho.rule;

    /**
     *
     * @arg {(string|string[])} val                -
     * @arg {Object}            [param={}]         -
     * @arg {boolean}           [param.trim=false] -
     * @arg {boolean}           [param.empty=true] -
     * @arg {string}            [type='']          - input type based on Kensho's own sorting rule
     */
    let fullsizeFunc = function(val, param = {}, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!fullsizeFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            let result  = true;

            let trim    = typeof param.trim  === 'boolean' ? param.trim  : false;
            let empty   = typeof param.empty === 'boolean' ? param.empty : true;
            let is2byte = Kensho.plugin.get('is2byte');

            if(trim) val = val.trim();
            if ( val.length === 0 ) return empty ? true : false;

            for(let i = 0, l = val.length; i < l; i++){
                if(!is2byte.func(val[i])){
                    result = false;
                    break;
                };
            }
            return result;
        }
    }
    rule.add('fullsize', fullsizeFunc);

})();

(()=>{
    let rule  = Kensho.rule;

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
    let halfsizeFunc = function(val, param = {}, type = ''){

        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!halfsizeFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            let result  = true;

            let trim    = typeof param.trim  === 'boolean' ? param.trim  : false;
            let empty   = typeof param.empty === 'boolean' ? param.empty : true;
            let is1byte = Kensho.plugin.get('is1byte');

            if(trim) val = val.trim();
            if ( val.length === 0 ) return empty ? true : false;

            for(let i = 0, l = val.length; i < l; i++){
                if(!is1byte.func(val[i])){
                    result = false;
                    break;
                };
            }
            return result;
        }
    }
    rule.add('halfsize', halfsizeFunc);

})();

(()=>{
    let rule = Kensho.rule;

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
    let numberFunc = function(val, param = {}, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!numberFunc(v, param, type)) result = false;
            });
            return result;
        } else {
            let allow2byteFlg = typeof param.allow2byte === 'boolean' ? param.allow2byte : false;
            let trimFlg       = typeof param.trim       === 'boolean' ? param.trim       : false;
            let empty         = typeof param.empty      === 'boolean' ? param.empty      : true;
            let full2half     = Kensho.plugin.get('full2half');

            if(allow2byteFlg) val = full2half.func(val);
            if(trimFlg) val = val.trim();
            if ( val.length === 0 ) return empty ? true : false;

            if(val.length === 0 && empty) return true;

            val *= 1;
            return isNaN(val) ? false : true;
        }
    }
    rule.add('number', numberFunc);

})();

(()=>{
    let rule = Kensho.rule;

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
    let ageFunc = function(val, param = {}, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!ageFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            let maxAge        = param.maxAge ? param.maxAge : 125;
            let allow2byteFlg = typeof param.allow2byte === 'boolean' ? param.allow2byte : false;
            let trim          = typeof param.trim       === 'boolean' ? param.trim       : false;
            let empty         = typeof param.empty      === 'boolean' ? param.empty      : true;
            let full2half     = Kensho.plugin.get('full2half');

            if(allow2byteFlg) val = full2half.func(val);
            if(trim) val = val.trim();
            if ( val.length === 0 ) return empty ? true : false;

            if(val.length === 0 && empty) return true; // empty
            if(!/^[0-9]+$/.test(val) || /^0/.test(val)) return false;
            if(val > maxAge) return false; // limit
            return true;
        }
    }
    rule.add('age', ageFunc);

})();

(()=>{
    let rule  = Kensho.rule;

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
    let emailFunc = function(val, param = {}, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!emailFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            let result       = true;
            let trim         = typeof param.trim  === 'boolean' ? param.trim  : false;
            let empty        = typeof param.empty === 'boolean' ? param.empty : true;
            let halfsizeRule = Kensho.rule.get('halfsize');

            if(trim) val = val.trim();
            if ( val.length === 0 ) return empty ? true : false;

            result = halfsizeRule(val, {}, type);
            if(!result) return result;

            // https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
            let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(val);
        }
    }
    rule.add('email', emailFunc);
})();

(()=>{
    let rule  = Kensho.rule;

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
    let blacklistFunc = function(val, param, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!blacklistFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            let result = true;
            let trim   = typeof param.trim  === 'boolean' ? param.trim  : false;
            let empty  = typeof param.empty === 'boolean' ? param.empty : true;

            if(trim) val = val.trim();
            if(val.length === 0) return empty ? true : false;
            if(!param.list) return true; // do noting

            param.list = Array.isArray(param.list) ? param.list : [param.list];

            for(let i = 0, l = param.list.length; i < l; i++){
                let reg;
                if(toString.call(param.list[i]) === '[object RegExp]'){
                    reg = param.list[i];
                }else{
                    reg = new RegExp(param.list[i]);
                }
                if(reg.test(val)){
                    result = false;
                    break;
                }
            }
            return result;
        }

    }
    rule.add('blacklist', blacklistFunc);

})();

(()=>{
    let rule  = Kensho.rule;

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
    let whitelistFunc = function(val, param, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!whitelistFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            let result = false;
            let trim   = typeof param.trim  === 'boolean' ? param.trim  : false;
            let empty  = typeof param.empty === 'boolean' ? param.empty : true;

            if(trim) val = val.trim();
            if(val.length === 0) return empty ? true : false;
            if(!param.list) return true; // do noting

            param.list = Array.isArray(param.list) ? param.list : [param.list];

            for(let i = 0, l = param.list.length; i < l; i++){
                let reg;
                if(toString.call(param.list[i]) === '[object RegExp]'){
                    reg = param.list[i];
                }else{
                    reg = new RegExp(param.list[i]);
                }
                if(reg.test(val)){
                    result = true;
                    break;
                }
            }
            return result;
        }
    }
    rule.add('whitelist', whitelistFunc);

})();

(()=>{
    let rule  = Kensho.rule;

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
    let rangeFunc = function(val, param = {}, type = ''){
        if(Array.isArray(val)){
            let result = true;
            val.forEach( v => {
                if(!rangeFunc(v, param, type)) result = false;
            });
            return result;
        }else{
            let result = true;

            let trim  = typeof param.trim  === 'boolean' ? param.trim  : false;
            let empty = typeof param.empty === 'boolean' ? param.empty : true;

            if ( trim ) val = val.trim();
            if ( val.length === 0 ) return empty ? true : false;

            if(param.min === undefined && param.max === undefined) return true;

            if(param.min === undefined && typeof param.max === 'number'){
                if(val.length > param.max) result = false;
            }
            if(typeof param.min === 'number' && param.max === undefined){
                if(val.length < param.min) result = false;
            }
            if(param.min !== undefined && param.max !== undefined){
                if(val.length < param.min || val.length > param.max) result = false;
            }
            return result;
        }
    }
    rule.add('range', rangeFunc);

})();

(()=>{
    let rule = Kensho.rule;

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
    let matchFunc = function(val, param = {}, type = ''){
        let empty = typeof param.empty === 'boolean' ? param.empty : true;

        if ( Array.isArray(val) ) {
            let arr      = val;
            let v        = param.val ? param.val : arr[0];
            let filtered = arr.filter( _v => v === _v );

            if(arr.length === filtered.length){
                if(!filtered[0].length) return empty;
                return true;
            }else{
                return false;
            }
        }else{
            // do noting
            if(!param.val) return true;

            if(!val.length) return empty;
            return val === param.val ? true : false;
        }
    }
    rule.add('match', matchFunc);

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

    let isNbyte = function(half){
        return function(val){
            let code = val.charCodeAt(0);
            let f    = (code >= 0x0 && code < 0x81) || (code == 0xf8f0) || (code >= 0xff61 && code < 0xffa0) || (code >= 0xf8f1 && code < 0xf8f4);
            return !(f ^ half);
        }
    }
    Kensho.plugin.add('is1byte', isNbyte(true));
    Kensho.plugin.add('is2byte', isNbyte(false));

})();

// NodeJS
if(typeof process !== "undefined" && typeof require !== "undefined"){
  module.exports = Kensho;
}
// Browser
else{
  window.Kensho = Kensho;
}
