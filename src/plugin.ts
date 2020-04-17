export const pluginBox: Map<string, any> = new Map()

export interface PluginStore {
  'charWidthMapAssign' : (map: {[x:string]:string}) => void
  'half2full'          : (str: string) => string
  'full2half'          : (str: string) => string
  'is1byte'            : (char: string) => boolean
  'is2byte'            : (char: string) => boolean
  'squash'             : (str: string, linebreak?: boolean) => string
}

export const plugin: {
  add<F extends Function>(name: string | 'value', method: F): void
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
