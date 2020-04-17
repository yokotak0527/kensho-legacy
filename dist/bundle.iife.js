var yokotak0527 = (function (exports) {
  'use strict';

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
      errorMessageWrapper: 'span',
      verbose: false,
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
    age: age
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
  const charWidthMapAssign = (map) => {
      Object.assign(charWidthMap, map);
  };
  const half2full = (str) => {
      return str.split('').map(char => {
          let returnVal = char;
          if (Kensho.use('is2byte', char))
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
  const full2half = (str) => {
      return str.split('').map(char => {
          let returnVal = char;
          if (Kensho.use('is1byte', char))
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
  const is2byte = (char) => {
      return _isNbyte(false, char);
  };
  const squash = (str, linebreak = false) => {
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
      constructor(formSelector) {
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
      static test() {
      }
      static use(pluginName, ...args) {
          const plugin = Kensho.plugin.get(pluginName);
          return plugin(...args);
      }
      add(inputElement, errorElement, rule, errorMessage, event = [''], unitName = '') {
          var _a;
          if (typeof inputElement === 'string') {
              const _elmSelector = inputElement;
              inputElement = this.form.querySelectorAll(_elmSelector);
              if (inputElement.length === 0)
                  throw new Error(`inputElement "${_elmSelector}" is not found in the form.`);
          }
          if (inputElement instanceof HTMLElement) {
              inputElement = [inputElement];
          }
          else if (inputElement instanceof NodeList) {
              if (inputElement.length === 0)
                  throw new Error('inputElement length is 0');
              const _arr = [];
              inputElement.forEach(elm => { _arr.push(elm); });
              inputElement = _arr;
          }
          if (typeof errorElement === 'string') {
              const _elmSelector = errorElement;
              const _elm = this.form.querySelector(errorElement);
              if (_elm === null)
                  throw new Error(`errorElement "${_elmSelector}" is not found in the form.`);
              errorElement = _elm;
          }
          if (!Array.isArray(errorMessage) && typeof errorMessage === 'object') {
              errorMessage = [errorMessage];
          }
          if (typeof event === 'string') {
              event = [event];
          }
          const inputRuleUnit = {
              name: (_a = unitName !== null && unitName !== void 0 ? unitName : inputElement[0].getAttribute('name')) !== null && _a !== void 0 ? _a : __unitNameSeed(),
              tagName: inputElement[0].tagName.toLowerCase(),
              inputElement,
              event,
              errorElement,
              errorMessage
          };
          this.inputsRules.set(inputRuleUnit.name, inputRuleUnit);
          return inputRuleUnit;
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

  return exports;

}({}));
