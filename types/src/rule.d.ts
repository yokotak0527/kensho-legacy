import { Kensho } from './Kensho';
declare type KenshoType = typeof Kensho;
declare type SimpleRuleType = (value: any, option?: Object, Kensho?: KenshoType) => boolean;
export declare type RuleType<V, O extends Object = undefined, K extends KenshoType = undefined> = K extends undefined ? O extends undefined ? (value: V) => boolean : (value: V, option: O) => boolean : (value: V, option: O, Kensho: K) => boolean;
export interface RuleStore {
    'required': RuleType<any>;
    'empty': RuleType<any>;
    'regexp': RuleType<string, {
        regexp: RegExp;
    }>;
    'email': RuleType<string, {}, KenshoType>;
    'list': RuleType<string | RegExp, {
        list: string[];
    }, KenshoType>;
    'number': RuleType<string | number>;
    'integer': RuleType<string | number, {}, KenshoType>;
    'naturalNumber': RuleType<string | number, {
        zero: boolean;
    }, KenshoType>;
    'positiveNumber': RuleType<string | number, {}, KenshoType>;
    'negativeNumber': RuleType<string | number, {}, KenshoType>;
    'zero': RuleType<string | number, {}, KenshoType>;
    'age': RuleType<string | number, {
        max: number;
    }, KenshoType>;
}
export declare type GetRuleType<N extends string, S extends RuleStore = RuleStore> = N extends keyof S ? S[N] : RuleType<any, Object, KenshoType>;
export declare const ruleBook: Map<string, any>;
export declare const rule: {
    add<V, O extends Object | undefined = undefined, K extends KenshoType | undefined = undefined>(name: string, callback: K extends undefined ? RuleType<V, O> : RuleType<V, O, K>): void;
    get<N extends string, S extends RuleStore = RuleStore>(name: N): N extends keyof S ? S[N] : SimpleRuleType;
    delete(name: string): void;
};
export {};
