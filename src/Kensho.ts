
import { ruleController } from '@src/rule'
import { FormController } from '@src/Form'
import * as coreRules from './rules/core'

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
    const rule = this.rule.get(ruleName)
    if (!rule) throw new Error(`${ruleName} rule is not defined.`)

    return rule(value, option)
  }
}

// add core rules
for (const [ruleName, callback] of Object.entries(coreRules)) Kensho.rule.add(ruleName, callback)
