import { RuleType, RuleTypeStore } from '@src/rule.d';
export declare const ruleBook: Map<string, any>;
export declare const rule: {
    add<V, O>(name: string, callback: RuleType<V, O>): void;
    get<N extends string>(name: N): N extends keyof RuleTypeStore ? RuleTypeStore[N] : RuleType<any, any>;
    delete(name: string): void;
};
