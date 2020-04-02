import { RuleType, RuleTypeStore } from '@src/rule.d'

// export const ruleBook: RuleMapInterface = new Map()
export const ruleBook: Map<string, any> = new Map()

export const rule: {
  add<V, O>(name: string, callback: RuleType<V, O>): void
  get<N extends string>(name: N): N extends keyof RuleTypeStore ? RuleTypeStore[N] : RuleType<any, any>
  delete(name: string): void
} = {
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
