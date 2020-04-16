import { RuleStore } from './rule';
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
        add<V, O extends Object = undefined, K extends typeof Kensho = undefined>(name: string, callback: K extends undefined ? O extends undefined ? (value: V) => boolean : (value: V, option: O) => boolean : import("./rule").RuleType<V, O, K>): void;
        get<N extends string, S extends RuleStore = RuleStore>(name: N): N extends keyof S ? S[N] : (value: any, option?: Object, Kensho?: typeof Kensho) => boolean;
        delete(name: string): void;
    };
    static plugin: {
        [x: string]: any;
        add<F extends Function>(name: string, method: F): void;
        get<N extends string>(name: N): N extends "half2full" | "full2half" | "is1byte" | "is2byte" ? import("./plugin").PluginTypeStore[N] : Function;
        delete(name: string): void;
    };
    static validate<N extends string, S extends RuleStore = RuleStore, A extends any[] = N extends keyof RuleStore ? Parameters<S[N]> : [any, Object?]>(rulename: N, value: A[0], option: A[1]): boolean;
    static validate<N extends string, S extends RuleStore = RuleStore, A extends any[] = N extends keyof RuleStore ? Parameters<S[N]> : [any, Object?]>(rulename: N, value: A[0]): boolean;
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
