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

class Kensho {
}
Kensho.rule = rule;

export { Kensho };
