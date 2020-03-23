'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const ruleBook = new Map();
const ruleController = {
    add(name, callback) {
        ruleBook.set(name, callback);
    },
    get(name) {
        const callback = ruleBook.get(name);
        return callback;
    },
    delete(name) {
        ruleBook.delete(name);
    }
};

class FormController {
    constructor() {
        return this;
    }
}

const regexp = (value, option) => {
    return option.regexp.test(value);
};

var coreRules = /*#__PURE__*/Object.freeze({
  __proto__: null,
  regexp: regexp
});

class Kensho {
    constructor() {
        this.form = new FormController();
        return this;
    }
    validate(...args) {
        return Kensho.validate(...args);
    }
    static validate(ruleName, value, option = {}) {
        const rule = this.rule.get(ruleName);
        if (!rule)
            throw new Error(`${ruleName} rule is not defined.`);
        return rule(value, option);
    }
}
Kensho.rule = ruleController;
for (const [ruleName, callback] of Object.entries(coreRules))
    Kensho.rule.add(ruleName, callback);

exports.Kensho = Kensho;
