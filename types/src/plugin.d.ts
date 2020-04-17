export declare const pluginBox: Map<string, any>;
export interface PluginStore {
    'charWidthMapAssign': (map: {
        [x: string]: string;
    }) => void;
    'half2full': (str: string) => string;
    'full2half': (str: string) => string;
    'is1byte': (char: string) => boolean;
    'is2byte': (char: string) => boolean;
    'squash': (str: string, linebreak?: boolean) => string;
}
export declare const plugin: {
    add<F extends Function>(name: string | 'value', method: F): void;
    get<N extends string, S extends PluginStore = PluginStore>(name: N): N extends keyof S ? S[N] : Function;
    delete(name: string): void;
    [x: string]: any;
};
