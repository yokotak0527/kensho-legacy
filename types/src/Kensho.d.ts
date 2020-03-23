import { FormController } from '@src/Form';
export declare class Kensho {
    form: FormController;
    static rule: {
        add<T, U>(name: string, callback: import("./rule").FunctionType<T, U>): void;
        get(name: string): Function | undefined;
        delete(name: string): void;
    };
    static plugin: {
        add(name: string, method: Function): void;
        get(name: string): Function | undefined;
        delete(name: string): void;
    };
    static validate<T>(ruleName: string, value: T, option?: {}): boolean;
    static usePlugin<T, U>(pluginName: string, ...args: [T]): U;
    constructor();
    validate<T>(...args: [string, T, {}]): boolean;
    hasError(): boolean;
}
