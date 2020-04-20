import { Kensho } from './Kensho';
export declare type HookNames = 'filter::getInputValue::after';
export declare class Hook {
    filterMap: Map<string, any>;
    actionMap: Map<string, any>;
    constructor(kensho: Kensho);
    add(): void;
    remove(): void;
}
