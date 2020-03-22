
import { ruleController } from '@src/rule'
import { FormController } from '@src/Form'
// import * as coreRules from './rules/core'

// import { rule } from './rule'

export class Kensho {
  form: FormController
  static rule = ruleController
  /**
   *
   */
  constructor () {
    this.form = new FormController()
    return this
  }

  /**
   *
   */
  validate<T> (...args: [string, T, {}]): boolean {
    return Kensho.validate(...args)
  }

  /**
   * @param {string} ruleName
   * @param {string} value
   * @param {Object} option={}
   */
  static validate<T> (ruleName: string, value: T, option = {}): boolean {
    return true
  }
}

const func = (value: string, callback: (arg: string) => boolean): boolean => callback(value)

func('hello', str => str === 'hello')

// type f = (arg: string) => string

// const f1: f = str => {
//   return `${str}!`
// }
// f1('hello')

// Kensho.rule.add('test', <T=string>(value: T, option = {}) => {
//   return true
// })

// add core rules
// for (const [ruleName, callback] of Object.entries(coreRules)) Kensho.rule.add(ruleName, callback)
