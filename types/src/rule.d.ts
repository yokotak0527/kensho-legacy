import { Kensho } from '@src/Kensho';
declare type KenshoType = typeof Kensho;
export declare type RuleType<V, O extends Object | undefined = undefined, K extends KenshoType | undefined = undefined> = K extends KenshoType ? (value: V, option: O, Kensho: K) => boolean : O extends Object ? (value: V, option: O) => boolean : (value: V) => boolean;
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
}
export declare const ruleBook: Map<string, any>;
export declare const rule: {
    add<V, O>(name: string, callback: RuleType<V, O>): void;
    get<N extends string, T extends RuleStore = RuleStore>(name: N): N extends keyof T ? T[N] : RuleType<any, Object, KenshoType>;
    delete(name: string): void;
};
export {};
