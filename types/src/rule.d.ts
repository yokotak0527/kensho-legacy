export declare type ruleFunction = <T>(value: T, option: {}) => boolean;
export declare const ruleBook: Map<string, ruleFunction>;
export declare const ruleController: {
    add(name: string, callback: ruleFunction): void;
    get(name: string): Function | undefined;
    delete(name: string): void;
};
