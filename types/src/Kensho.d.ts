import { RuleTypeStore, RuleType } from '@src/rule';
export interface InputRuleUnitType {
    name: string;
    tagName: string;
    inputElement: HTMLElement[];
    errorElement: HTMLElement | undefined;
    event: string[];
    errorMessage: Array<{
        [x: string]: string;
    }> | undefined;
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
        get<N extends string, T extends RuleTypeStore = RuleTypeStore>(name: N): N extends keyof T ? T[N] : RuleType<any, any>;
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
        name: string;
        option?: object;
    } | Array<{
        name: string;
        option?: object;
    }>, errorMessage: {
        name: string;
        message: string;
    } | Array<{
        name: string;
        message: string;
    }> | undefined, event?: string | string[], unitName?: string): InputRuleUnitType;
}
export interface MyRuleTypeStore extends RuleTypeStore {
    'myRule': RuleType<string, {}>;
}
