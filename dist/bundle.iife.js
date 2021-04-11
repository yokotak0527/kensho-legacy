var Kensho = (function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    const ruleBook = new Map();
    const rule = {
        add(name, callback) {
            ruleBook.set(name, callback);
        },
        get(name) {
            const callback = ruleBook.get(name);
            if (callback === undefined)
                throw new Error(`Rule "${name}" is not found.`);
            return callback;
        },
        delete(name) {
            ruleBook.delete(name);
        }
    };

    const pluginBox = new Map();
    const plugin = {
        add(name, method) {
            pluginBox.set(name, method);
        },
        get(name) {
            const method = pluginBox.get(name);
            if (method === undefined)
                throw new Error(`Plugin "${name}" is not found.`);
            return method;
        },
        delete(name) {
            pluginBox.delete(name);
        }
    };

    const config = {
        customAttrPrefix: 'k-',
        errorMessageWrapper: 'span',
        verbose: true,
        errorClassName: 'kensho-has-error',
        errorItemClassName: 'kensho-error-message',
        autocomplete: false,
        HTML5novalidate: true
    };

    const required = value => {
        if (typeof value === 'string')
            return value.trim() !== '';
        if (typeof value === 'number')
            return true;
        if (Array.isArray(value))
            return value.length !== 0;
        if (typeof value === 'object' && value !== null)
            return Object.keys(value).length !== 0;
        if (value === undefined || value === null)
            return false;
        return true;
    };
    const empty = (value) => {
        if (typeof value === 'string')
            return value === '';
        if (typeof value === 'number')
            return false;
        if (Array.isArray(value))
            return value.length === 0;
        if (typeof value === 'object' && value !== null)
            return Object.keys(value).length === 0;
        if (value === undefined)
            return true;
        return false;
    };
    const regexp = (value, { regexp }) => {
        return regexp.test(value);
    };
    const email = (value, option, Kensho) => {
        return Kensho.validate('regexp', value, { regexp: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ });
    };
    const list = (value, { list }, Kensho) => {
        let hit = false;
        for (let i = 0, l = list.length; i < l; i++) {
            if (value instanceof RegExp) {
                hit = Kensho.validate('regexp', list[i], { regexp: value });
                if (hit)
                    break;
            }
            else if (value === list[i]) {
                hit = true;
                break;
            }
        }
        return hit;
    };
    const number = value => {
        if (typeof value === 'number')
            return true;
        if (value.trim() === '')
            return false;
        return !Number.isNaN(value * 1);
    };
    const integer = (value, option, Kensho) => {
        if (!Kensho.validate('number', value))
            return false;
        if (typeof value === 'string') {
            value = parseInt(value, 10);
        }
        return value % 1 === 0;
    };
    const naturalNumber = (value, { zero = false }, Kensho) => {
        if (!Kensho.validate('integer', value))
            return false;
        if (typeof value === 'string') {
            value = parseInt(value, 10);
        }
        if (zero && value === 0)
            return true;
        return value > 0;
    };
    const positiveNumber = (value, option, Kensho) => {
        if (!Kensho.validate('number', value))
            return false;
        if (typeof value === 'string') {
            value = parseInt(value, 10);
        }
        return value > 0;
    };
    const negativeNumber = (value, option, Kensho) => {
        if (!Kensho.validate('number', value))
            return false;
        if (typeof value === 'string') {
            value = parseInt(value, 10);
        }
        return value < 0;
    };
    const zero = (value, option, Kensho) => {
        if (!Kensho.validate('number', value))
            return false;
        if (typeof value === 'string') {
            value = parseInt(value, 10);
        }
        return value === 0;
    };
    const age = (value, { max = 125 }, Kensho) => {
        if (!Kensho.validate('naturalNumber', value, { zero: true }))
            return false;
        if (typeof value === 'string') {
            value = parseInt(value, 10);
        }
        return value <= max;
    };
    const equal = (value, { others, isInput = true }) => {
        let result = true;
        if (typeof others === 'string')
            others = [others];
        for (const other of others) {
            let otherValue;
            if (isInput) {
                const element = document.querySelector(other);
                if (!element) {
                    result = false;
                    break;
                }
                otherValue = element.value;
            }
            else {
                otherValue = other;
            }
            if (value !== otherValue) {
                result = false;
                break;
            }
        }
        return result;
    };
    const letters = (value, { range = {} }) => {
        const fixRange = Object.assign({ min: -1, max: -1 }, range);
        fixRange.min = typeof fixRange.min === 'string' ? parseInt(fixRange.min, 10) : fixRange.min;
        fixRange.max = typeof fixRange.max === 'string' ? parseInt(fixRange.max, 10) : fixRange.max;
        if (fixRange.min < 0 && fixRange.max < 0)
            throw new Error('To use the letters rule, you need to specify number that is 0 or more for either `range.min` or `range.max`');
        if (fixRange.min < 0 && fixRange.max >= 0)
            return value.length <= fixRange.max;
        if (fixRange.min >= 0 && fixRange.max < 0)
            return value.length >= fixRange.min;
        if (fixRange.min > fixRange.max)
            throw new Error('You cannot specify a number larger than `range.max` in `range.min`');
        if (fixRange.min >= 0 && fixRange.max >= 0)
            return value.length >= fixRange.min && value.length <= fixRange.max;
        return false;
    };

    var _rules = /*#__PURE__*/Object.freeze({
        __proto__: null,
        required: required,
        empty: empty,
        regexp: regexp,
        email: email,
        list: list,
        number: number,
        integer: integer,
        naturalNumber: naturalNumber,
        positiveNumber: positiveNumber,
        negativeNumber: negativeNumber,
        zero: zero,
        age: age,
        equal: equal,
        letters: letters
    });

    const charWidthMap = {};
    Object.assign(charWidthMap, {
        '０': '0', '１': '1', '２': '2', '３': '3', '４': '4',
        '５': '5', '６': '6', '７': '7', '８': '8', '９': '9'
    });
    Object.assign(charWidthMap, {
        'ａ': 'a', 'ｂ': 'b', 'ｃ': 'c', 'ｄ': 'd', 'ｅ': 'e',
        'ｆ': 'f', 'ｇ': 'g', 'ｈ': 'h', 'ｉ': 'i', 'ｊ': 'j',
        'ｋ': 'k', 'ｌ': 'l', 'ｍ': 'm', 'ｎ': 'n', 'ｏ': 'o',
        'ｐ': 'p', 'ｑ': 'q', 'ｒ': 'r', 'ｓ': 's', 'ｔ': 't',
        'ｕ': 'u', 'ｖ': 'v', 'ｗ': 'w', 'ｘ': 'x', 'ｙ': 'y',
        'ｚ': 'z'
    });
    Object.assign(charWidthMap, {
        'Ａ': 'A', 'Ｂ': 'B', 'Ｃ': 'C', 'Ｄ': 'D', 'Ｅ': 'E',
        'Ｆ': 'F', 'Ｇ': 'G', 'Ｈ': 'H', 'Ｉ': 'I', 'Ｊ': 'J',
        'Ｋ': 'K', 'Ｌ': 'L', 'Ｍ': 'M', 'Ｎ': 'N', 'Ｏ': 'O',
        'Ｐ': 'P', 'Ｑ': 'Q', 'Ｒ': 'R', 'Ｓ': 'S', 'Ｔ': 'T',
        'Ｕ': 'U', 'Ｖ': 'V', 'Ｗ': 'W', 'Ｘ': 'X', 'Ｙ': 'Y',
        'Ｚ': 'Z'
    });
    Object.assign(charWidthMap, {
        '－': '-', '（': '(', '）': ')', '＿': '_', '／': '/',
        '＋': '+', '：': ':', '；': ';', '］': ']', '［': '[',
        '＠': '@', '！': '!', '＜': '<', '＞': '>', '？': '?',
        '｛': '{', '｝': '}', '＊': '*', '”': '"', '’': "'",
        '〜': '~', '＾': '^', '￥': '¥', '｜': '|', '＆': '&',
        '％': '%', '＃': '#', '＄': '$', '　': ' ', '＝': '='
    });
    const charWidthMapAssign = function (map) {
        Object.assign(charWidthMap, map);
    };
    const half2full = function (str) {
        return str.split('').map(char => {
            let returnVal = char;
            if (this.use('is2byte', char))
                return returnVal;
            for (const [key, value] of Object.entries(charWidthMap)) {
                if (value === char) {
                    returnVal = key;
                    break;
                }
            }
            return returnVal;
        }).join('');
    };
    const full2half = function (str) {
        return str.split('').map(char => {
            let returnVal = char;
            if (this.use('is1byte', char))
                return returnVal;
            for (const [key, value] of Object.entries(charWidthMap)) {
                if (key === char) {
                    returnVal = value;
                    break;
                }
            }
            return returnVal;
        }).join('');
    };
    const _isNbyte = (half, char) => {
        const code = char.charCodeAt(0);
        const f = (code >= 0x0 && code < 0x81) || (code === 0xf8f0) || (code >= 0xff61 && code < 0xffa0) || (code >= 0xf8f1 && code < 0xf8f4);
        return half ? f : !f;
    };
    const is1byte = (char) => {
        return _isNbyte(true, char);
    };
    const is2byte = function (char) {
        return _isNbyte(false, char);
    };
    const squash = function (str, linebreak = false) {
        const regexp = linebreak ? /([^\S]|[\t\n])+/gm : /([^\S]|\t)+/gm;
        return str.trim().replace(regexp, '');
    };

    var defaultPlugins = /*#__PURE__*/Object.freeze({
        __proto__: null,
        charWidthMapAssign: charWidthMapAssign,
        half2full: half2full,
        full2half: full2half,
        is1byte: is1byte,
        is2byte: is2byte,
        squash: squash
    });

    const defaultRules = _rules;
    const _unitNameSeed_ = (() => {
        const list = [];
        const makeSeed = () => {
            let seed = `k_${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`;
            if (typeof list.find(elm => elm === seed) === 'string')
                seed = makeSeed();
            return seed;
        };
        return () => {
            const seed = makeSeed();
            list.push(seed);
            return seed;
        };
    })();
    class Kensho {
        constructor(formSelector, option = {}) {
            this.isDestroyed = false;
            option = Object.assign({
                search: true
            }, option);
            if (typeof formSelector === 'string') {
                const _form = document.querySelector(formSelector);
                if (_form === null)
                    throw new Error(`form "${formSelector}" is not found.`);
                formSelector = _form;
            }
            this.form = formSelector;
            {
                this.defaultHasAutoCompleteAttr = this.form.getAttribute('autocomplete') !== null ? true : false;
                this.defaultAutoComplete = this.form.autocomplete;
                if (!Kensho.config.autocomplete) {
                    this.form.setAttribute('autocomplete', 'off');
                    this.form.autocomplete = 'off';
                }
            }
            this.ruleUnits = new Map();
            this.form.classList.add('kensho-form');
            if (option.search) {
                this.addFromUnitElements(this.search());
            }
            return this;
        }
        static validate(ruleName, ...args) {
            if (args[1] === undefined) {
                return rule.get(ruleName)(args[0], {}, Kensho);
            }
            else {
                return rule.get(ruleName)(args[0], args[1], Kensho);
            }
        }
        static use(pluginName, ...args) {
            const plugin = Kensho.plugin.get(pluginName).bind(Kensho);
            return plugin(...args, Kensho);
        }
        destroy() {
            this.form.autocomplete = this.defaultAutoComplete;
            if (this.defaultHasAutoCompleteAttr) {
                this.form.setAttribute('autocomplete', this.defaultAutoComplete);
            }
            else {
                this.form.removeAttribute('autocomplete');
            }
            this.form.classList.remove('kensho-form');
            this.removeAll();
            this.isDestroyed = true;
        }
        addFromUnitElements(inputElmsData) {
            const prefix = Kensho.config.customAttrPrefix;
            for (const [unitName, data] of Object.entries(inputElmsData)) {
                if (this.ruleUnits.get(unitName) !== undefined)
                    throw new Error(`The "${unitName}" rule unit is already exsisted.`);
                const _inputElm = data.input;
                const name = unitName;
                const errorElement = data.error;
                const rawRule = _inputElm.getAttribute(`${prefix}rule`);
                if (rawRule === null)
                    throw new Error(`The \`${prefix}rule\` attribute is not found in the element where \`${prefix}name="${unitName}"\` is specified.`);
                const rule = this.parseAttrString2Array(rawRule);
                let inputElement = data.input;
                const typeAttr = data.input.getAttribute('type');
                if (typeAttr === 'radio') {
                    inputElement = this.form.querySelectorAll(`input[name="${data.input.getAttribute('name')}"]`);
                }
                const strEvents = _inputElm.getAttribute(`${prefix}event`);
                let rawEvent = strEvents !== null ? strEvents : undefined;
                if (typeof rawEvent === 'string') {
                    rawEvent = this.parseAttrString2Array(rawEvent);
                }
                const event = rawEvent;
                const strAllowEmpty = _inputElm.getAttribute(`${prefix}allowempty`);
                const allowEmpty = strAllowEmpty === 'on' || strAllowEmpty === 'true' || strAllowEmpty === '' ? true : false;
                const strMessage = _inputElm.getAttribute(`${prefix}message`);
                let rawErrorMessage = strMessage !== null ? strMessage : undefined;
                if (typeof rawErrorMessage === 'string') {
                    rawErrorMessage = rawErrorMessage
                        .trim()
                        .replace(/\n/gm, '')
                        .replace(/'/g, '"')
                        .replace(/\\/, '\\\\')
                        .replace(/\\\\"/g, '\'');
                    if (/^{.+}$/.test(rawErrorMessage)) {
                        rawErrorMessage = JSON.parse(rawErrorMessage);
                    }
                }
                const errorMessage = rawErrorMessage;
                const strFilter = _inputElm.getAttribute(`${prefix}filter`);
                let rawFilter = strFilter !== null ? strFilter : '';
                let valueFilter;
                if (typeof rawFilter === 'string') {
                    rawFilter = this.parseAttrString2Array(rawFilter);
                    valueFilter = function (value, Kensho) {
                        for (const filter of rawFilter) {
                            if (typeof filter === 'string') {
                                value = Kensho.use(filter, value);
                            }
                            else {
                                value = Kensho.use(filter[0], value, ...filter[1]);
                            }
                        }
                        return value;
                    };
                }
                this.add({
                    inputElement,
                    errorElement,
                    errorMessage,
                    rule,
                    event,
                    valueFilter,
                    name,
                    allowEmpty
                });
            }
        }
        search() {
            const prefix = Kensho.config.customAttrPrefix;
            const match = this.form.querySelectorAll(`*[${prefix}name]`);
            const _list = {};
            for (const item of match) {
                let name = item.getAttribute(`${prefix}name`);
                const type = /\.error$/.test(name) ? 'error' : 'input';
                if (type === 'error') {
                    name = name.replace('.error', '');
                }
                if (_list[name] === undefined) {
                    _list[name] = {};
                }
                if (type === 'input') {
                    if (_list[name].input !== undefined) {
                        throw new Error(`There are two or more \`k-name\` attributes of the same value. "${name}"`);
                    }
                    _list[name].input = item;
                }
                else if (type === 'error') {
                    if (_list[name].error !== undefined) {
                        throw new Error(`There are two or more \`k-name\` attributes of the same value. "${name}.error"`);
                    }
                    _list[name].error = item;
                }
            }
            const list = {};
            for (const [name, obj] of Object.entries(_list)) {
                if (obj.input !== undefined) {
                    list[name] = obj;
                }
                else {
                    throw new Error(`No \`k-name="${name}"\` attribute in HTML input form against \`k-name="${name}.error"\``);
                }
            }
            return list;
        }
        add(param) {
            if (typeof param.inputElement === 'string') {
                const _elmSelector = param.inputElement;
                param.inputElement = this.form.querySelectorAll(_elmSelector);
                if (param.inputElement.length === 0)
                    throw new Error(`inputElement parameter "${_elmSelector}" is not found in the form.`);
            }
            if (param.inputElement instanceof HTMLInputElement) {
                param.inputElement = [param.inputElement];
            }
            else if (param.inputElement instanceof HTMLSelectElement) {
                param.inputElement = [param.inputElement];
            }
            else if (param.inputElement instanceof NodeList) {
                if (param.inputElement.length === 0)
                    throw new Error('inputElement parameter length is 0');
                const _arr = [];
                param.inputElement.forEach(elm => { _arr.push(elm); });
                param.inputElement = _arr;
            }
            if (typeof param.rule === 'string') {
                param.rule = [[param.rule, {}]];
            }
            param.rule = param.rule.map(rule => {
                return typeof rule === 'string' ? [rule, {}] : rule;
            });
            if (param.errorMessage === undefined) {
                param.errorMessage = {};
            }
            else if (typeof param.errorMessage === 'string') {
                param.errorMessage = { default: param.errorMessage };
            }
            param.errorMessage = Object.assign({ default: 'The value has error.' }, param.errorMessage);
            if (param.errorElement === undefined) {
                param.errorMessage = undefined;
            }
            else if (typeof param.errorElement === 'string') {
                const _elmSelector = param.errorElement;
                const _elm = this.form.querySelector(param.errorElement);
                if (_elm === null)
                    throw new Error(`errorElement parameter "${_elmSelector}" is not found in the form.`);
                param.errorElement = _elm;
            }
            if (param.event === undefined) {
                param.event = [];
            }
            else if (typeof param.event === 'string') {
                param.event = [param.event];
            }
            if (param.name === undefined)
                param.name = _unitNameSeed_();
            param.allowEmpty = param.allowEmpty ? true : false;
            const tagName = param.inputElement[0].tagName.toLowerCase();
            let type = '';
            if (tagName === 'input') {
                type = param.inputElement[0].getAttribute('type') || 'text';
            }
            else {
                type = tagName;
            }
            if (type === 'password' || type === 'search' || type === 'tel' ||
                type === 'email' || type === 'url' || type === 'number' ||
                type === 'datetime' || type === 'date' || type === 'month' ||
                type === 'week' || type === 'time' || type === 'datetime-local')
                type = 'text';
            const eventHandlers = [];
            param.inputElement.forEach((elem, elemNum) => {
                const events = param.event;
                eventHandlers[elemNum] = {};
                const handlers = eventHandlers[elemNum];
                events.forEach(event => {
                    handlers[`kenshoEventHandler__${event}`] = () => {
                        this.validate(param.name);
                    };
                    elem.addEventListener(event, handlers[`kenshoEventHandler__${event}`]);
                });
            });
            const unit = Object.assign({}, param, {
                tagName,
                type,
                error: [],
                eventHandlers,
                displayError: param.errorElement !== undefined
            });
            this.ruleUnits.set(unit.name, unit);
            return unit;
        }
        remove(ruleUnitName) {
            const unit = this.getRuleUnit(ruleUnitName);
            unit.inputElement.forEach((elem, elemNum) => {
                unit.event.forEach(eventName => {
                    elem.removeEventListener(eventName, unit.eventHandlers[elemNum][`kenshoEventHandler__${eventName}`]);
                });
            });
            this.ruleUnits.delete(ruleUnitName);
        }
        removeAll() {
            const names = [];
            this.ruleUnits.forEach(unit => {
                names.push(unit.name);
            });
            names.forEach(name => {
                this.remove(name);
            });
        }
        hasError() {
            let hasError = false;
            this.ruleUnits.forEach((val) => {
                if (val.error.length > 0)
                    hasError = true;
            });
            return hasError;
        }
        getRuleUnit(ruleUnitName) {
            const unit = this.ruleUnits.get(ruleUnitName);
            if (unit === undefined)
                throw new Error(`${ruleUnitName} is not found.`);
            return unit;
        }
        getInputValue(unit) {
            let value = '';
            if (unit.type === 'text') {
                value = unit.inputElement[0].value;
            }
            if (unit.type === 'radio') {
                for (let i = 0, l = unit.inputElement.length; i < l; i++) {
                    const elem = unit.inputElement[i];
                    if (elem.checked) {
                        value = elem.value;
                        break;
                    }
                }
            }
            if (unit.type === 'checkbox') {
                const elem = unit.inputElement[0];
                if (elem.checked) {
                    value = elem.value;
                }
            }
            if (unit.type === 'select') {
                const elem = unit.inputElement[0];
                value = elem.options[elem.options.selectedIndex].value;
            }
            return value;
        }
        clear(unit) {
            unit.error = [];
            if (unit.displayError) {
                if (unit.errorElement) {
                    unit.errorElement.innerHTML = '';
                }
            }
        }
        clearAll() {
            this.ruleUnits.forEach((val, key) => this.clear(this.getRuleUnit(key)));
        }
        validate(ruleUnitName) {
            const unit = this.getRuleUnit(ruleUnitName);
            let value = this.getInputValue(unit);
            if (unit.valueFilter !== undefined)
                value = unit.valueFilter.bind(this)(value, Kensho);
            this.clear(unit);
            for (const [ruleName, option] of unit.rule) {
                if (ruleName !== 'required' && unit.allowEmpty && value === '')
                    continue;
                if (!Kensho.validate(ruleName, value, option)) {
                    unit.error.push(ruleName);
                }
            }
            if (unit.error.length > 0 && unit.displayError) {
                this.displayError(unit);
            }
            return unit.error.length === 0;
        }
        validateAll() {
            this.ruleUnits.forEach((val, key) => this.validate(key));
        }
        displayError(_a) {
            var { errorElement, displayError, errorMessage } = _a, unit = __rest(_a, ["errorElement", "displayError", "errorMessage"]);
            if (!errorElement || !displayError || unit.error.length === 0 || !errorMessage)
                return;
            const errors = [];
            const wrapper = Kensho.config.errorMessageWrapper;
            const errorItemClassName = Kensho.config.errorItemClassName;
            for (const ruleName of unit.error) {
                if (ruleName === 'default')
                    continue;
                const msg = errorMessage[ruleName] === undefined ? `The value failed "${ruleName}" validation rule.` : errorMessage[ruleName];
                errors.push(`<${wrapper} class="${errorItemClassName}">${msg}</${wrapper}>`);
            }
            const error = Kensho.config.verbose ? errors.join('') : `<${wrapper} class="${errorItemClassName}">${errorMessage.default}</${wrapper}>`;
            errorElement.innerHTML = error;
        }
        parseAttrString2Array(value) {
            value = value.trim()
                .replace(/\s*([0-9a-z\-_]+)\s*,/gmi, '\'$1\',')
                .replace(/\s*([0-9a-zA-Z\-_]+)$/, '\'$1\'')
                .replace(/\/(.+)\/([gimsuy]*)/, '"/$1/$2"')
                .replace(/\\/g, '\\\\');
            value = `[${value}]`
                .replace(/'/g, '"')
                .replace(/\\\\"/g, '\'');
            const returnVal = JSON.parse(value).map((elem) => this.parseString2RightType(elem));
            return returnVal;
        }
        parseString2RightType(val) {
            if (Array.isArray(val)) {
                val = val.map(v => this.parseString2RightType(v));
            }
            else if (typeof val === 'object') {
                for (const key in val) {
                    val[key] = this.parseString2RightType(val[key]);
                }
            }
            else if (typeof val === 'string') {
                const match = (val.match(/(\/.+\/)([gimsuy]*)/));
                if (match !== null) {
                    match[1] = match[1].replace(/^\//, '').replace(/\/$/, '');
                    val = match[2] === '' ? new RegExp(match[1]) : new RegExp(match[1], match[2]);
                }
            }
            return val;
        }
    }
    Kensho.config = config;
    Kensho.rule = rule;
    Kensho.plugin = plugin;
    for (const [ruleName, callback] of Object.entries(defaultRules)) {
        Kensho.rule.add(ruleName, callback);
    }
    for (const [pluginName, method] of Object.entries(defaultPlugins)) {
        Kensho.plugin.add(pluginName, method);
    }

    return Kensho;

}());
