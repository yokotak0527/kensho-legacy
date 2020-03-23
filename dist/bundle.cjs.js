'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const ruleBook = new Map();
const ruleController = {
    add(name, callback) {
        ruleBook.set(name, callback);
    },
    get(name) {
        return ruleBook.get(name);
    },
    delete(name) {
        ruleBook.delete(name);
    }
};

const pluginBox = new Map();
const pluginController = {
    add(name, method) {
        pluginBox.set(name, method);
    },
    get(name) {
        return pluginBox.get(name);
    },
    delete(name) {
        pluginBox.delete(name);
    }
};

class FormController {
    constructor() {
        return this;
    }
}

const half2full = (str) => {
    return str.split('').map(char => {
        return String.fromCharCode(char.charCodeAt(0) - 0xfee0);
    }).join();
};
const full2half = (str) => {
    return str;
};

var charWidthConv = /*#__PURE__*/Object.freeze({
  __proto__: null,
  half2full: half2full,
  full2half: full2half
});

const list = {};
Object.assign(list, charWidthConv);

class Kensho {
    constructor() {
        this.form = new FormController();
        return this;
    }
    static validate(ruleName, value, option = {}) {
        const rule = this.rule.get(ruleName);
        if (rule === undefined)
            throw new Error(`${ruleName} rule is not found.`);
        return rule(value, option, this);
    }
    static usePlugin(pluginName, ...args) {
        const plugin = this.plugin.get(pluginName);
        if (plugin === undefined)
            throw new Error(`${pluginName} plugin is not found.`);
        return plugin(...args);
    }
    validate(...args) {
        return Kensho.validate(...args);
    }
    hasError() {
        return true;
    }
}
Kensho.rule = ruleController;
Kensho.plugin = pluginController;
for (const [ruleName, method] of Object.entries(list))
    Kensho.plugin.add(ruleName, method);

exports.Kensho = Kensho;
