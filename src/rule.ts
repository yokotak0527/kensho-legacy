export type ruleFunction = <T>(value: T, option: {}) => boolean

export const ruleBook: Map<string, ruleFunction> = new Map()
export const ruleController = {
  /**
   * add the validation rule
   */
  add (name: string, callback: ruleFunction): void {
    ruleBook.set(name, callback)
  },
  /**
   * get callback function
   */
  get (name: string): Function|undefined {
    const callback = ruleBook.get(name)
    return callback
  },
  /**
   * delete the validation rule
   */
  delete (name: string): void {
    ruleBook.delete(name)
  }
}
