export const pluginBox:Map<string, any> = new Map()

export const plugin:Kensho.Plugin.Methods = {
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
