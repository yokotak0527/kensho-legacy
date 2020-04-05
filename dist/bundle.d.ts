import { RuleTypeStore } from '@src/rule';

declare type RuleType<V, O extends Object> = (value: V, option: O, Kensho: any) => boolean;

declare class Kensho {
    static rule: {
        add<V, O>(name: string, callback: RuleType<V, O>): void;
        get<N extends string>(name: N): N extends "regexp" | "email" | "list" ? RuleTypeStore[N] : RuleType<any, any>;
        delete(name: string): void;
    };
}

export { Kensho };
