import { Kensho } from '@src/Kensho';
export declare type FunctionType<T, U extends {
    [x: string]: any;
}> = (value: T, option: U, Kensho: Kensho) => boolean;
export declare const ruleBook: Map<string, Function>;
export declare const ruleController: {
    add<T, U>(name: string, callback: FunctionType<T, U>): void;
    get(name: string): Function | undefined;
    delete(name: string): void;
};
