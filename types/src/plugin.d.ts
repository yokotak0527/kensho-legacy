export declare const pluginBox: Map<string, Function>;
export declare const pluginController: {
    add(name: string, method: Function): void;
    get(name: string): Function | undefined;
    delete(name: string): void;
};
