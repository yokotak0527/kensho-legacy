'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

class FormController {
    constructor() {
        return this;
    }
}

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

var _rules = /*#__PURE__*/Object.freeze({
  __proto__: null,
  regexp: regexp,
  email: email,
  list: list
});

const defaultRules = _rules;
class Kensho {
    constructor() {
        this.form = new FormController();
        return this;
    }
    static validate(ruleName, value, option = {}) {
        const rule = this.rule.get(ruleName);
        return rule(value, option, this);
    }
}
Kensho.rule = rule;
Kensho.plugin = plugin;
for (const [ruleName, callback] of Object.entries(defaultRules)) {
    Kensho.rule.add(ruleName, callback);
}

exports.Kensho = Kensho;
