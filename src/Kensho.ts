import { ruleController } from '@src/rule'
import { pluginController } from '@src/plugin'
import { FormController } from '@src/Form'
import * as coreRules from '@src/rules/core'
import plugins from '@src/plugins/index'

export class Kensho {
  form: FormController
  static rule = ruleController
  static plugin = pluginController

  /**
   *
   */
  static validate<T> (ruleName: string, value: T, option = {}): boolean {
    const rule = this.rule.get(ruleName)
    if (rule === undefined) throw new Error(`${ruleName} rule is not found.`)

    return rule(value, option, this)
  }

  /**
   *
   */
  static usePlugin<T, U>(pluginName: string, ...args: [T]): U {
    const plugin = this.plugin.get(pluginName)
    if (plugin === undefined) throw new Error(`${pluginName} plugin is not found.`)

    return plugin(...args)
  }

  /**
   *
   */
  constructor () {
    this.form = new FormController()
    return this
  }

  /**
   * @todo
   */
  validate<T> (...args: [string, T, {}]): boolean {
    return Kensho.validate(...args)
  }

  /**
   * @todo
   */
  hasError (): boolean {
    return true
  }
}

// add core rules
// for (const [ruleName, callback] of Object.entries(coreRules)) Kensho.rule.add(ruleName, callback)

// install plugins
for (const [ruleName, method] of Object.entries(plugins)) Kensho.plugin.add(ruleName, method)
