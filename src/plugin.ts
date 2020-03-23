export const pluginBox: Map<string, Function> = new Map()

export const pluginController = {
  /**
   *
   */
  add (name: string, method: Function): void {
    pluginBox.set(name, method)
  },
  /**
   *
   */
  get (name: string): Function|undefined {
    return pluginBox.get(name)
  },
  /**
   *
   */
  delete (name: string): void {
    pluginBox.delete(name)
  }
}
