export declare type RuleType<V, O extends Object> = (value: V, option: O, Kensho: any) => boolean;
export interface RuleTypeStore {
    'regexp': RuleType<string, {
        regexp: RegExp;
    }>;
    'email': RuleType<string, {}>;
    'list': RuleType<string | RegExp, {
        list: string[];
    }>;
}
