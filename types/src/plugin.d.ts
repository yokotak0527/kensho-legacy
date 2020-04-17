interface PluginMap extends Map<string, any> {
    get(key: string): any | never;
}
export declare const pluginBox: PluginMap;
export interface PluginStore {
    'half2full': (str: string) => string;
    'full2half': (str: string) => string;
    'is1byte': (char: string) => boolean;
    'is2byte': (char: string) => boolean;
}
export declare const plugin: {
    add<F extends Function>(name: string, method: F): void;
    get<N extends string, S extends PluginStore = PluginStore>(name: N): N extends keyof S ? S[N] : Function;
    delete(name: string): void;
    [x: string]: any;
};
export {};
