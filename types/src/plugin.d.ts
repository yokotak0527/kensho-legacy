export interface PluginTypeStore {
    half2full(str: string): string;
    full2half(str: string): string;
    is1byte(char: string): boolean;
    is2byte(char: string): boolean;
}
export declare const plugin: {
    add<F extends Function>(name: string, method: F): void;
    get<N extends string>(name: N): N extends keyof PluginTypeStore ? PluginTypeStore[N] : Function;
    delete(name: string): void;
    [x: string]: any;
};
