interface PluginMap extends Map<string, any> {
  // clear(): void;
  // delete(key: K): boolean;
  // forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
  get(key: string): any | never
  // has(key: K): boolean;
  // set(key: K, value: V): this;
  // readonly size: number;
}

export const pluginBox: PluginMap = new Map()

export interface PluginStore {
  'half2full' : (str: string) => string
  'full2half' : (str: string) => string
  'is1byte'   : (char: string) => boolean
  'is2byte'   : (char: string) => boolean
}

// Kensho.use()
export const plugin: {
  add<F extends Function>(name: string, method: F): void
  get<N extends string, S extends PluginStore = PluginStore>(name: N): N extends keyof S ? S[N] : Function
  delete(name: string): void
  [x: string]: any
} = {
  /**
   *
   */
  add (name, method) {
    pluginBox.set(name, method)
  },
  /**
   *
   */
  get (name) {
    const method = pluginBox.get(name)
    if (method === undefined) throw new Error(`Plugin "${name}" is not found.`)
    return method
  },
  /**
   *
   */
  delete (name) {
    pluginBox.delete(name)
  }
}
