import { Kensho } from '@src/Kensho'

export type FunctionType<T, U extends {[x: string]: any}> = (value: T, option: U, Kensho: Kensho) => boolean

export const ruleBook: Map<string, Function> = new Map()

export const ruleController = {
  /**
   * add rule
   */
  add<T, U> (name: string, callback: FunctionType<T, U>): void {
    ruleBook.set(name, callback)
  },
  /**
   * get callback function
   */
  get (name: string): Function|undefined {
    return ruleBook.get(name)
  },
  /**
   * delete rule
   */
  delete (name: string): void {
    ruleBook.delete(name)
  }
}
