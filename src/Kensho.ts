import { rule, RuleTypeStore, RuleType } from '@src/rule'
import { plugin }         from '@src/plugin'
import config             from '@src/config'
import * as _rules        from '@src/defaults/rules'
import * as _plugins      from '@src/defaults/plugins'

const defaultRules = _rules as RuleTypeStore

export interface InputRuleUnitType {
  name         : string
  tagName      : string
  inputElement : HTMLElement[]
  errorElement : HTMLElement | undefined
  event        : string[]
  errorMessage : Array<{[x:string]: string}> | undefined
}

const __unitNameSeed = (() => {
  const list:string[] = []
  const makeSeed = ():string => {
    let seed = `k_${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`
    if (typeof list.find(elm => elm === seed) === 'string') seed = makeSeed()
    return seed
  }
  return ():string => {
    const seed = makeSeed()
    list.push(seed)
    return seed
  }
})()
// =============================================================================
//
// Kensho Class
//
// =============================================================================
export class Kensho {
  public form: HTMLElement
  private readonly inputsRules:Map<string, InputRuleUnitType>
  static config = config
  static rule   = rule
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
  constructor (formSelector: string|HTMLElement) {
    if (typeof formSelector === 'string') {
      const _form = document.querySelector<HTMLElement>(formSelector)
      if (_form === null) throw new Error(`form "${formSelector}" is not found.`)
      formSelector = _form
    }
    this.form = formSelector

    //
    if (!Kensho.config.autocomplete) this.form.setAttribute('autocomplete', 'off')

    this.inputsRules = new Map()
    this.form.classList.add('kensho-form')
    return this
  }

  /**
   * @todo
   */
  add<T> (
    inputElement : string | HTMLElement | NodeListOf<HTMLElement> | HTMLElement[],
    errorElement : string | HTMLElement | undefined,
    rule         : {name:string, option?:object} | Array<{name:string, option?:object}>,
    errorMessage : {name:string, message:string} | Array<{name:string, message:string}> | undefined,
    event        : string | string[] = [''],
    unitName = ''
  ): InputRuleUnitType {
    if (typeof inputElement === 'string') { // string -> NodeList<HTMLElement>
      const _elmSelector = inputElement
      inputElement = this.form.querySelectorAll(_elmSelector)
      if (inputElement.length === 0) throw new Error(`inputElement "${_elmSelector}" is not found in the form.`)
    }
    if (inputElement instanceof HTMLElement) { // HTMLElement -> HTMLElement[]
      inputElement = [inputElement]
    } else if (inputElement instanceof NodeList) { // NodeList<HTMLElement> -> HTMLElement[]
      if (inputElement.length === 0) throw new Error('inputElement length is 0')
      const _arr:HTMLElement[] = []
      inputElement.forEach(elm => { _arr.push(elm) })
      inputElement = _arr
    }
    // definitely, the nputElement is HTMLElement[] and it is not zero length.

    if (typeof errorElement === 'string') {
      const _elmSelector = errorElement
      const _elm = this.form.querySelector<HTMLElement>(errorElement)
      if (_elm === null) throw new Error(`errorElement "${_elmSelector}" is not found in the form.`)
      errorElement = _elm
    }

    if (!Array.isArray(rule)) {
      rule = [rule]
    }

    if (!Array.isArray(errorMessage) && typeof errorMessage === 'object') {
      errorMessage = [errorMessage]
    }

    if (typeof event === 'string') {
      event = [event]
    }

    const inputRuleUnit: InputRuleUnitType = {
      name    : unitName ?? inputElement[0].getAttribute('name') ?? __unitNameSeed(),
      tagName : inputElement[0].tagName.toLowerCase(),
      inputElement,
      event,
      errorElement,
      errorMessage
    }
    this.inputsRules.set(inputRuleUnit.name, inputRuleUnit)
    return inputRuleUnit
  }

  /**
   * @todo
   */
  // delete (): void {

  // }

  /**
   * @todo
  */
  // hasError (): boolean {

  // }

  /**
   * @todo
  */
  // clear (): void {

  // }

  /**
   *
  */
  // validate () {

  // }
}

// add default rules
for (const [ruleName, callback] of Object.entries(defaultRules)) {
  Kensho.rule.add(ruleName, callback)
}

// add default plugins
for (const [pluginName, method] of Object.entries(_plugins)) {
  Kensho.plugin.add(pluginName, method)
}

export interface MyRuleTypeStore extends RuleTypeStore {
  'myRule':RuleType<string, {}>
}

// export const myRule: MyRuleTypeStore['myRule'] = (value, opt) => {
//   return true
// }
// Kensho.rule.add('myRule', myRule)

// Kensho.rule.add('test', () => {
//   return true
// })
// const t = Kensho.rule.get<string, >('test')

// const kensho = new Kensho('form')
// kensho.add('.input', '.error', [{name:required}])
