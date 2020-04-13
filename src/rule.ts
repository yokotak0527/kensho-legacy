// import { RuleType, RuleTypeStore } from '@src/rule.d'
export type RuleType<V, O extends Object> = (value: V, option: O, Kensho: any) => boolean

export interface RuleTypeStore {
  'required' : RuleType<string, {}>
  'regexp'   : RuleType<string, { regexp: RegExp }>
  'email'    : RuleType<string, {}>
  'list'     : RuleType<string | RegExp, { list: string[] }>
}

// -----------------------------------------------------------------------------

export const ruleBook: Map<string, any> = new Map()

export const rule: {
  add<V, O>(name: string, callback: RuleType<V, O>): void
  get<N extends string, T extends RuleTypeStore = RuleTypeStore>(name: N): N extends keyof T ? T[N] : RuleType<any, any>
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
