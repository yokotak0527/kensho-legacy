import { rule }           from '@src/rule'
import { plugin }         from '@src/plugin'
import { RuleTypeStore }  from '@src/rule.d'
import { FormController } from '@src/Form'
import * as _rules from '@src/defaults/rules.ts'

const defaultRules = _rules as RuleTypeStore

export class Kensho {
  form: FormController
  static rule = rule
  static plugin = plugin

  /**
   *
   */
  static validate<T> (ruleName: string, value: T, option = {}): boolean {
    const rule = this.rule.get(ruleName)
    return rule(value, option, this)
  }

  /**
   *
   */
  // static usePlugin<T, U>(pluginName: string, ...args: [T]): U {
  //   const plugin = this.plugin.get(pluginName)
  //   if (plugin === undefined) throw new Error(`${pluginName} plugin is not found.`)

  //   return plugin(...args)
  // }

  /**
   *
   */
  constructor () {
    this.form = new FormController()
    return this
  }

  // /**
  //  * @todo
  //  */
  // validate<T> (...args: [string, T, {}]): boolean {
  //   return Kensho.validate(...args)
  // }

  // /**
  //  * @todo
  //  */
  // hasError (): boolean {
  //   return true
  // }
}

// add core rules
for (const [ruleName, callback] of Object.entries(defaultRules)) {
  Kensho.rule.add(ruleName, callback)
}

// const test = Kensho.rule.get('email')
// Kensho.rule.add('test', (value, option) => {
//   return true
// })

// install plugins
// console.log(pluginList)
// for (const [ruleName, method] of Object.entries(plugins)) Kensho.plugin.add(ruleName, method)
