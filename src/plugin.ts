const pluginBox: Map<string, any> = new Map()
export interface PluginTypeStore {
  half2full(str: string): string
  full2half(str: string): string
  is1byte(char: string): boolean
  is2byte(char: string): boolean
}

export const plugin: {
  add<F extends Function>(name: string, method: F): void
  get<N extends string>(name: N): N extends keyof PluginTypeStore ? PluginTypeStore[N] : Function
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
