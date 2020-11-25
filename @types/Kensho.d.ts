/// <reference types="./@types/" />
declare type PluginStore = Kensho.Plugin.Store;
declare type RuleStore = Kensho.Rule.Store;
declare type AnyFunction = Kensho.AnyFunction;
interface AddParams<F = AnyFunction> {
    inputElement: string | Kensho.InputElementTypes | NodeListOf<HTMLInputElement> | Kensho.InputElementTypes[];
    rule: string | Array<string | [string, {
        [x: string]: any;
    }]>;
    errorMessage?: string | {
        [ruleName: string]: string;
    };
    errorElement?: string | HTMLElement;
    event?: string | string[];
    name?: string;
    allowEmpty?: boolean;
    valueFilter?: F;
}
declare class Kensho {
    form: HTMLFormElement;
    defaultAutoComplete: string;
    defaultHasAutoCompleteAttr: boolean;
    isDestroyed: boolean;
    private readonly ruleUnits;
    static config: Kensho.Config;
    static rule: Kensho.Rule.Methods;
    static plugin: Kensho.Plugin.Methods;
    static validate<N extends string, S extends RuleStore = RuleStore, F = N extends keyof S ? S[N] : AnyFunction, A extends any[] = F extends AnyFunction ? Parameters<F> : never>(rulename: N, value: A[0], option: A[1]): boolean;
    static validate<N extends string, S extends RuleStore = RuleStore, F = N extends keyof S ? S[N] : AnyFunction, A extends any[] = F extends AnyFunction ? Parameters<F> : never>(rulename: N, value: A[0]): boolean;
    static use<N extends string, S extends PluginStore = PluginStore, F = N extends keyof S ? S[N] : AnyFunction>(pluginName: N, ...args: F extends AnyFunction ? Parameters<F> : never): F extends AnyFunction ? ReturnType<F> : never;
    constructor(formSelector: string | HTMLFormElement, option?: {
        search?: boolean;
    });
    destroy(): void;
    addFromUnitElements(inputElmsData: Kensho.RuleUnitElements): void;
    search(): Kensho.RuleUnitElements;
    add(param: AddParams): Kensho.RuleUnit;
    remove(ruleUnitName: string): void;
    removeAll(): void;
    hasError(): boolean;
    getRuleUnit(ruleUnitName: string): Kensho.RuleUnit;
    getInputValue(unit: Kensho.RuleUnit): string;
    clear(unit: Kensho.RuleUnit): void;
    allClear(): void;
    validate(ruleUnitName: string): boolean;
    allValidate(): void;
    displayError({ errorElement, displayError, errorMessage, ...unit }: Kensho.RuleUnit): void;
    private parseAttrString2Array;
    private parseString2RightType;
}
export default Kensho;
