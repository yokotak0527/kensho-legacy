export declare const plugin: {
    add(name: string, method: Function): void;
    get(name: string): Function;
    delete(name: string): void;
    [x: string]: any;
};
