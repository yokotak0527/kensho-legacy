export declare type RuleType<V, O extends Object> = (value: V, option: O, Kensho: any) => boolean;
export interface RuleTypeStore {
    'required': RuleType<any, {}>;
    'empty': RuleType<any, {}>;
    'regexp': RuleType<string, {
        regexp: RegExp;
    }>;
    'email': RuleType<string, {}>;
    'list': RuleType<string | RegExp, {
        list: string[];
    }>;
}
export declare const ruleBook: Map<string, any>;
export declare const rule: {
    add<V, O>(name: string, callback: RuleType<V, O>): void;
    get<N extends string, T extends RuleTypeStore = RuleTypeStore>(name: N): N extends keyof T ? T[N] : RuleType<any, any>;
    delete(name: string): void;
};
