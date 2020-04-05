import { RuleTypeStore, RuleType } from '@src/rule';
export interface InputRuleUnitType {
    name: string;
    inputElement: HTMLElement[];
    errorElement: HTMLElement;
    errorMessage: {
        [x: string]: string;
    };
}
export declare class Kensho {
    form: HTMLElement;
    private readonly inputsRules;
    static config: {
        errorMessageWrapper: string;
        verbose: boolean;
        errorClassName: string;
        autocomplete: boolean;
        HTML5novalidate: boolean;
    };
    static rule: {
        add<V, O>(name: string, callback: RuleType<V, O>): void;
        get<N extends string>(name: N): N extends "regexp" | "email" | "list" ? RuleTypeStore[N] : RuleType<any, any>;
        delete(name: string): void;
    };
    static plugin: {
        [x: string]: any;
        add<F extends Function>(name: string, method: F): void;
        get<N extends string>(name: N): N extends "half2full" | "full2half" | "is1byte" | "is2byte" ? import("./plugin").PluginTypeStore[N] : Function;
        delete(name: string): void;
    };
    static validate<T>(ruleName: string, value: T, option?: {}): boolean;
    constructor(formSelector: string | HTMLElement);
    add<T>(inputElement: string | HTMLElement | NodeListOf<HTMLElement> | HTMLElement[], errorElement: string | HTMLElement | undefined, rule: {
        name: keyof RuleTypeStore;
        option?: object;
    } | Array<{
        name: keyof RuleTypeStore;
        option?: object;
    }>, event?: string | string[], unitName?: string): void;
}
export interface RuleTypeStore {
    't': string;
}
