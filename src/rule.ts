// import { RuleType, RuleTypeStore } from '@src/rule.d'
import { Kensho } from '@src/Kensho'
type KenshoType = typeof Kensho

export type RuleType<V, O extends Object | undefined = undefined, K extends KenshoType | undefined = undefined> =
  K extends KenshoType ? (value: V, option: O, Kensho: K) => boolean :
    O extends Object ? (value: V, option: O) => boolean :
      (value:V) => boolean

export interface RuleStore {
  'required' : RuleType<any>
  'empty'    : RuleType<any>
  'regexp'   : RuleType<string, { regexp: RegExp }>
  'email'    : RuleType<string, {}, KenshoType>
  'list'     : RuleType<string | RegExp, { list: string[] }, KenshoType>
  'number'   : RuleType<string | number>
  'integer'  : RuleType<string | number, {}, KenshoType>
}

type GetRuleType<N extends string, T extends RuleStore = RuleStore> = (name: N) => N extends keyof T ? T[N] : RuleType<any, Object, KenshoType>

// -----------------------------------------------------------------------------

export const ruleBook: Map<string, any> = new Map()

export const rule: {
  add<V, O>(name: string, callback: RuleType<V, O>): void
  get<N extends string, T extends RuleStore = RuleStore>(name: N): N extends keyof T ? T[N] : RuleType<any, Object, KenshoType>
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
