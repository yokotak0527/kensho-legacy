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
         *  検証対象(input)を追加する
         *
         * @version 0.0.1
         * @memberof Kensho
         * @instance
         *
         * @arg {(string|HTMLElement|HTMLElement[])} inputElement - form input HTML element or its CSS selector string.
         * @arg {(string|HTMLElement)}               errorElement - wrapper element of output error message or its CSS selector string.
         * @arg {Object}                             rule         - the key is rule name. The value is error message.
         * @arg {string|string[]}                    [event=['']] - trigger events.
         *
         * @return {this}
         */
        add(inputElement, errorElement, rule, event = ['']){
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
            event        = typeof event        === 'string' ? event.split('|') : event;


            let name    = inputElement[0].getAttribute('name');  // input name attr.
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

            unit = this.hook.filter('validate-filed', unit);

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

            this.hook.action('set-validate-field', {unit : unit});
            return this;
        }
        /**
         * Return bool value that form has invalid data whether or hasn't.
         * 
         * @version 0.0.1
         * @memberof Kensho
         * @instance
         *
         * @return {boolean}
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
         * @version 0.0.1
         * @memberof Kensho
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
         * @version 0.0.1
         * @memberof Kensho
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

            for(let ruleName in applyRules){

                // validate
                let values    = [];
                let ruleParam = applyRules[ruleName]['param'];
                inputElement.filter( elm => {
                    if( unit.type === 'radio' ){
                        values.push(elm.checked);
                    }else if( unit.type === 'checkbox' ){
                        values.push(elm.checked);
                    }else{
                        values.push(elm.value);
                    }
                });
                Kensho.rule.get(ruleName).check(values, ruleParam, unit.type);

                
                // for(let i = 0, l = inputElement.length; i < l; i++){
                // 
                //     // let val = 
                //     // console.log(inputElement[i].checked);
                // }
                
                // console.log(inputElement);
                // console.log(applyRules[key]);
            }

            // if(unit.type === 'text'){
            //     value = unit.inputElement.value;
            // }else{
            //     value = this.formElement[unit.name] ? this.formElement[unit.name] : value;
            // }
            // // console.log(value);
            // if(unit.type === 'textarea'){
            //     // console.log();
            // }
            // 
            // unit.errorElement.innerHTML = '';
            // unit.errorElement.classList.remove(errorClassName);
            // unit.error                  = [];
            // // if(Kensho.config.get('validationPseudoClass')) unit.inputElement.setCustomValidity('');
            // unit.inputElement.classList.remove('invalid');
            // unit.inputElement.classList.remove('valid');
            // 
            // value = this.hook.filter('pre-validate-value', value, this);
            // 
            // for(let key in applyRules){
            //     let result = Kensho.validate.call(this, key, value, applyRules[key].param);
            //     if(!result){
            //         let message = document.createTextNode(applyRules[key].errorMessage).nodeValue;
            //         message = message.replace(/\<+script[\s\S]*\/script[^>]*>/img, '');
            //         unit.error.push(`<${wrapTag} class="kensho-error-message">${message}</${wrapTag}>`);
            //         if(!verbose) break;
            //     }
            // }
            // if(unit.error.length){
            //     unit.errorElement.classList.add(errorClassName);
            //     unit.errorElement.innerHTML = unit.error.join('\n');
            //     unit.inputElement.classList.add('invalid');
            // }else{
            //     unit.inputElement.classList.add('valid');
            // }
            // return this;
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
