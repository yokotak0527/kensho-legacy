export declare type RuleFunctionType = (value: any, option: any) => boolean;
export declare const ruleBook: Map<string, RuleFunctionType>;
export declare const ruleController: {
    add(name: string, callback: RuleFunctionType): void;
    get(name: string): Function | undefined;
    delete(name: string): void;
};
