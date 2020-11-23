export const ruleBook:Map<string, any> = new Map()

const rule:Kensho.Rule.Methods = {
  /**
   * add rule
   */
  add (name, callback) {
    ruleBook.set(name, callback)
  },
  /**
   * get callback function
   */
  get (name) {
    const callback = ruleBook.get(name)
    if (callback === undefined) throw new Error(`Rule "${name}" is not found.`)
    return callback
  },
  /**
   * delete rule
   */
  delete (name) {
    ruleBook.delete(name)
  }
}

export default rule