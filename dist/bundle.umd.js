(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.yokotak0527 = {}));
}(this, (function (exports) { 'use strict';

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
      if (value === undefined)
          return false;
      if (value === null)
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
  const equal = (value, { others }) => {
      let result = true;
      if (typeof others === 'string')
          others = [others];
      for (const other of others) {
          if (value !== other) {
              result = false;
              break;
          }
      }
      return result;
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
    equal: equal
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

  var _plugins = /*#__PURE__*/Object.freeze({
    __proto__: null,
    charWidthMapAssign: charWidthMapAssign,
    half2full: half2full,
    full2half: full2half,
    is1byte: is1byte,
    is2byte: is2byte,
    squash: squash
  });

  const defaultRules = _rules;
  const __unitNameSeed = (() => {
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
          if (!Kensho.config.autocomplete)
              this.form.setAttribute('autocomplete', 'off');
          this.inputsRules = new Map();
          this.form.classList.add('kensho-form');
          if (option.search) {
              this.addFromCustomAttrs(this.search());
          }
          return this;
      }
      static validate(ruleName, ...args) {
          const rule = Kensho.rule.get(ruleName);
          if (args[1] === undefined) {
              return rule(args[0], {}, Kensho);
          }
          else {
              return rule(args[0], args[1], Kensho);
          }
      }
      static use(pluginName, ...args) {
          const plugin = Kensho.plugin.get(pluginName).bind(Kensho);
          return plugin(...args);
      }
      addFromCustomAttrs(CustomAttrs) {
          const attrPrefix = Kensho.config.customAttrPrefix;
          for (const [unitName, data] of Object.entries(CustomAttrs)) {
              if (this.inputsRules.get(unitName) !== undefined)
                  throw new Error(`The "${unitName}" rule unit is already exsisted.`);
              const _inputElm = data.input;
              const name = unitName;
              const errorElement = data.error;
              const rawRule = _inputElm.getAttribute(`${attrPrefix}rule`);
              if (rawRule === null)
                  throw new Error(`The \`k-rule\` attribute is not found in the element where \`k-name="${unitName}"\` is specified.`);
              const rule = this.parseAttrStr2Arr(rawRule);
              let inputElement = data.input;
              const typeAttr = data.input.getAttribute('type');
              if (typeAttr === 'radio') {
                  inputElement = this.form.querySelectorAll(`input[name="${data.input.getAttribute('name')}"]`);
              }
              let rawEvent = _inputElm.getAttribute(`${attrPrefix}event`) !== null ? _inputElm.getAttribute(`${attrPrefix}event`) : undefined;
              if (typeof rawEvent === 'string') {
                  rawEvent = this.parseAttrStr2Arr(rawEvent);
              }
              const event = rawEvent;
              let rawErrorMessage = _inputElm.getAttribute(`${attrPrefix}message`) !== null ? _inputElm.getAttribute(`${attrPrefix}message`) : undefined;
              if (typeof rawErrorMessage === 'string') {
                  rawErrorMessage = rawErrorMessage
                      .trim()
                      .replace(/\n/gm, '')
                      .replace(/'/g, '"');
                  if (/^{.+}$/.test(rawErrorMessage)) {
                      rawErrorMessage = JSON.parse(rawErrorMessage);
                  }
              }
              const errorMessage = rawErrorMessage;
              let rawFilter = _inputElm.getAttribute(`${attrPrefix}filter`) !== null ? _inputElm.getAttribute(`${attrPrefix}filter`) : undefined;
              let valueFilter;
              if (typeof rawFilter === 'string') {
                  rawFilter = this.parseAttrStr2Arr(rawFilter);
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
              const addParam = {
                  inputElement,
                  errorElement,
                  errorMessage,
                  rule,
                  event,
                  valueFilter,
                  name
              };
              this.add(addParam);
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
                      console.error(`There are two or more \`k-name\` attributes of the same value. "${name}"`);
                  }
                  _list[name].input = item;
              }
              else if (type === 'error') {
                  if (_list[name].error !== undefined) {
                      console.error(`There are two or more \`k-name\` attributes of the same value. "${name}.error"`);
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
                  console.error(`No \`k-name="${name}"\` attribute in HTML input form against \`k-name="${name}.error"\``);
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
              param.name = __unitNameSeed();
          const tagName = param.inputElement[0].tagName.toLowerCase();
          let type = '';
          if (tagName === 'input') {
              type = param.inputElement[0].getAttribute('type');
          }
          else {
              type = tagName;
          }
          if (type === 'password' || type === 'search' || type === 'tel' ||
              type === 'email' || type === 'url' || type === 'number' ||
              type === 'datetime' || type === 'date' || type === 'month' ||
              type === 'week' || type === 'time' || type === 'datetime-local')
              type = 'text';
          param.inputElement.forEach(elem => {
              const events = param.event;
              events.forEach(event => {
                  elem.addEventListener(event, () => {
                      this.validate(param.name);
                  });
              });
          });
          const unit = Object.assign({}, param, {
              tagName,
              type,
              error: [],
              displayError: param.errorElement !== undefined
          });
          this.inputsRules.set(unit.name, unit);
          return unit;
      }
      hasError() {
          let hasError = false;
          this.inputsRules.forEach((val, key) => {
              if (val.error.length > 0)
                  hasError = true;
          });
          return hasError;
      }
      getRuleUnit(ruleUnitName) {
          const unit = this.inputsRules.get(ruleUnitName);
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
          unit.errorElement.innerHTML = '';
      }
      allClear() {
          this.inputsRules.forEach((val, key) => this.clear(this.getRuleUnit(key)));
      }
      validate(ruleUnitName) {
          const unit = this.getRuleUnit(ruleUnitName);
          let value = this.getInputValue(unit);
          if (unit.valueFilter !== undefined)
              value = unit.valueFilter.bind(this)(value, Kensho);
          this.clear(unit);
          for (const [ruleName, option] of unit.rule) {
              if (!Kensho.validate(ruleName, value, option)) {
                  unit.error.push(ruleName);
              }
          }
          if (unit.error.length > 0 && unit.displayError) {
              this.displayError(unit);
          }
          return unit.error.length === 0;
      }
      allValidate() {
          this.inputsRules.forEach((val, key) => this.validate(key));
      }
      displayError(unit) {
          if (!unit.displayError || unit.error.length === 0)
              return undefined;
          const errors = [];
          const wrapper = Kensho.config.errorMessageWrapper;
          for (const ruleName of unit.error) {
              if (ruleName === 'default')
                  continue;
              const msg = unit.errorMessage[ruleName] === undefined ? `The value does not meet "${ruleName}" validation rule.` : unit.errorMessage[ruleName];
              errors.push(`<${wrapper}>${msg}</${wrapper}>`);
          }
          const error = Kensho.config.verbose ? errors.join('') : `<${wrapper}>${unit.errorMessage.default}</${wrapper}>`;
          unit.errorElement.innerHTML = error;
      }
      parseAttrStr2Arr(value) {
          value = value.trim()
              .replace(/\s*([0-9a-z\-_]+)\s*,/gmi, '\'$1\',')
              .replace(/\s*([0-9a-zA-Z\-_]+)$/, '\'$1\'')
              .replace(/\/(.+)\/([gimsuy]*)/, '"/$1/$2"');
          value = `[${value}]`
              .replace(/'/g, '"');
          const returnVal = JSON.parse(value).map(elem => this.parseString2rightType(elem));
          return returnVal;
      }
      parseString2rightType(val) {
          if (Array.isArray(val)) {
              val = val.map(v => this.parseString2rightType(v));
          }
          else if (typeof val === 'object') {
              for (const key in val) {
                  val[key] = this.parseString2rightType(val[key]);
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
  for (const [pluginName, method] of Object.entries(_plugins)) {
      Kensho.plugin.add(pluginName, method);
  }

  exports.Kensho = Kensho;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
