import { RuleTypeStore } from '@src/rule.d';
import { FormController } from '@src/Form';
export declare class Kensho {
    form: FormController;
    static rule: {
        add<V, O>(name: string, callback: import("./rule").RuleType<V, O>): void;
        get<N extends string>(name: N): N extends "regexp" | "email" | "list" ? RuleTypeStore[N] : import("./rule").RuleType<any, any>;
        delete(name: string): void;
    };
    static plugin: {
        [x: string]: any;
        add(name: string, method: Function): void;
        get(name: string): Function;
        delete(name: string): void;
    };
    static validate<T>(ruleName: string, value: T, option?: {}): boolean;
    constructor();
}
