const pluginBox: Map<string, Function> = new Map()

export const plugin: {
  add(name: string, method: Function): void
  get(name: string): Function
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
