import { RuleStore, RuleType } from './rule';
import { PluginStore } from './plugin';
declare type _F = (...args: any) => any;
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
        add<V, O extends Object = undefined, K extends typeof Kensho = undefined>(name: string, callback: K extends undefined ? O extends undefined ? (value: V) => boolean : (value: V, option: O) => boolean : RuleType<V, O, K>): void;
        get<N extends string, S extends RuleStore = RuleStore>(name: N): N extends keyof S ? S[N] : (value: any, option?: Object, Kensho?: typeof Kensho) => boolean;
        delete(name: string): void;
    };
    static plugin: {
        [x: string]: any;
        add<F extends Function>(name: string, method: F): void;
        get<N extends string, S extends PluginStore = PluginStore>(name: N): N extends keyof S ? S[N] : Function;
        delete(name: string): void;
    };
    static validate<N extends string, S extends RuleStore = RuleStore, F = N extends keyof S ? S[N] : _F, A extends any[] = F extends _F ? Parameters<F> : never>(rulename: N, value: A[0], option: A[1]): boolean;
    static validate<N extends string, S extends RuleStore = RuleStore, F = N extends keyof S ? S[N] : _F, A extends any[] = F extends _F ? Parameters<F> : never>(rulename: N, value: A[0]): boolean;
    static test<T>(): void;
    static use<N extends string, S extends PluginStore = PluginStore, F = N extends keyof S ? S[N] : _F>(pluginName: N, ...args: F extends _F ? Parameters<F> : never): F extends _F ? ReturnType<F> : never;
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
export {};
