// import { rule, RuleStore, RuleType, GetRuleType } from './rule'
import { rule, RuleStore, RuleType }     from './rule'
import { plugin, PluginStore } from './plugin'
import config                  from './config'
import * as _rules             from './defaults/rules'
import * as _plugins           from './defaults/plugins'

type _F = (...args:any) => any

const defaultRules = _rules as RuleStore

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
  private readonly inputsRules: Map<string, InputRuleUnitType>
  static config = config
  static rule   = rule
  static plugin = plugin

  /**
   * validate the value
   */
  static validate<N extends string, S extends RuleStore = RuleStore, F = N extends keyof S ? S[N] : _F, A extends any[] = F extends _F ? Parameters<F> : never> (rulename:N, value:A[0], option:A[1]) :boolean
  static validate<N extends string, S extends RuleStore = RuleStore, F = N extends keyof S ? S[N] : _F, A extends any[] = F extends _F ? Parameters<F> : never> (rulename:N, value:A[0]) :boolean
  static validate (ruleName:string, ...args:any[]): boolean {
    interface MyRuleStore extends RuleStore {
      'test' : RuleType<string, {prop1:number}>
    }

    const rule = Kensho.rule.get(ruleName)
    if (args[1] === undefined) {
      return rule(args[0], {}, Kensho)
    } else {
      return rule(args[0], args[1], Kensho)
    }
  }

  static test<
    T
  >():void{

  }

  /**
   *
   */
  static use<N extends string, S extends PluginStore = PluginStore, F = N extends keyof S ? S[N] : _F> (pluginName:N, ...args: F extends _F ? Parameters<F> : never):F extends _F ? ReturnType<F> : never {
    const plugin = Kensho.plugin.get(pluginName)
    return plugin(...args)
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

  // GetRuleType

  // add2 () {
  //   // this.add2({'regexp'})
  // }

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

// const f = Kensho.plugin.get('half2full')
// f()
