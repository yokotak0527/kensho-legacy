
import { ruleController } from './rule'
import { FormController } from './Form'
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

// Kensho.rule.add('test', <T=string>(value: T, option = {}) => {
//   return true
// })

// add core rules
// for (const [ruleName, callback] of Object.entries(coreRules)) Kensho.rule.add(ruleName, callback)
