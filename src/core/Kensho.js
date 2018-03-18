import 'babel-polyfill'
/**
 * HTMLフォームバリデーションクラス
 *
 * @class Kensho
 */
let initialized = false;

// =============================================================================
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

import _config from 'core/Kensho.config.js'; Kensho.config = _config;
import _Hook   from 'core/Kensho.Hook.js';   Kensho.Hook   = _Hook;
import _rule   from 'core/Kensho.rule.js';   Kensho.rule   = _rule;
import _plugin from 'core/Kensho.plugin.js'; Kensho.plugin = _plugin;

// plugins
import _full2halfPlugin from 'plugin/full2half.js'; _full2halfPlugin(Kensho);
import _isNbytePlugin   from 'plugin/is-n-byte.js'; _isNbytePlugin(Kensho);

// rules
import _requiredRule  from 'rule/required.js';  _requiredRule(Kensho);
import _numberdRule   from 'rule/number.js';    _numberdRule(Kensho);
import _agedRule      from 'rule/age.js';       _agedRule(Kensho);
import _emaildRule    from 'rule/email.js';     _emaildRule(Kensho);
import _rangedRule    from 'rule/range.js';     _rangedRule(Kensho);
import _fullsizedRule from 'rule/fullsize.js';  _fullsizedRule(Kensho);
import _halfsizeRule  from 'rule/halfsize.js';  _halfsizeRule(Kensho);
import _whitelistRule from 'rule/whitelist.js'; _whitelistRule(Kensho);
import _blacklistRule from 'rule/blacklist.js'; _blacklistRule(Kensho);
import _matchRule     from 'rule/match.js';     _matchRule(Kensho);

if(typeof window !== 'undefined') window.Kensho = Kensho;
if(typeof process !== "undefined" && typeof require !== "undefined"){
    module.exports = Kensho;
}
export default Kensho;
