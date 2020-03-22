import { FormController } from '@src/Form';
export declare class Kensho {
    form: FormController;
    static rule: {
        add(name: string, callback: import("./rule").ruleFunction): void;
        get(name: string): Function | undefined;
        delete(name: string): void;
    };
    constructor();
    validate<T>(...args: [string, T, {}]): boolean;
    static validate<T>(ruleName: string, value: T, option?: {}): boolean;
}
