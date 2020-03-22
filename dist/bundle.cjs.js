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

class Kensho {
    constructor() {
        this.form = new FormController();
        return this;
    }
    validate(...args) {
        return Kensho.validate(...args);
    }
    static validate(ruleName, value, option = {}) {
        return true;
    }
}
Kensho.rule = ruleController;
const func = (value, callback) => callback(value);
func('hello', str => str === 'hello');

exports.Kensho = Kensho;
