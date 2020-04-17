import { Kensho } from './Kensho';
export declare type HookNames = 'filter::validate::before' | 'filter::validate::after';
export declare class Hook {
    constructor(kensho: Kensho);
    add(): void;
    remove(): void;
    trigger(): void;
}
