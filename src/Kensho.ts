// import { rule, RuleStore, RuleType, GetRuleType } from './rule'
import { rule, RuleStore, RuleType } from './rule'
import { plugin, PluginStore }       from './plugin'
// import { Hook, HookNames }           from './Hook'
import config                        from './config'
import * as _rules                   from './defaults/rules'
import * as _plugins                 from './defaults/plugins'

interface CustomAttrSearchResult { [name:string] : { input : HTMLInputElement, error? : HTMLElement } }
type _F = (...args:any) => any

const defaultRules = _rules as RuleStore

export interface InputRuleUnitType {
  inputElement  : HTMLInputElement[]
  rule          : Array<[ string, { [ x : string ] : any } ]>
  errorMessage  : {[ruleName:string]:string} | undefined
  errorElement  : HTMLElement | undefined
  error         : string[]
  displayError  : boolean
  event         : string[]
  name          : string
  tagName       : string
  type          : string
  valueFilter   : Function | undefined
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
  // private readonly hook : Hook
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

    //
    // this.hook = new Hook(this)

    this.inputsRules = new Map()
    this.form.classList.add('kensho-form')

    this.search()

    return this
  }

  /**
   *
   */
  search ():CustomAttrSearchResult {
    const prefix = Kensho.config.customAttrPrefix
    const match = this.form.querySelectorAll(`*[${prefix}name]`)

    const list:{ [x:string] : { input? : HTMLInputElement, error? : HTMLElement } } = {}
    for (const item of match) {
      let name = item.getAttribute(`${prefix}name`)
      const type = /\.error$/.test(name) ? 'error' : 'input'
      if (type === 'error') {
        name = name.replace('.error', '')
      }
      if (this.inputsRules.get(name) !== undefined) throw new Error(`The "${name}" rule unit is already exsisted.`)

      if (list[name] === undefined) {
        list[name] = {}
      }
      if (type === 'input') {
        if (list[name].input !== undefined) throw new Error(`There are two or more \`k-name\` attributes of the same value. "${name}"`)
        list[name].input = item as HTMLInputElement
      } else if (type === 'error') {
        if (list[name].error !== undefined) throw new Error(`There are two or more \`k-name\` attributes of the same value. "${name}.error"`)
        list[name].error = item as HTMLElement
      }
    }
    /** @todo ~.errorがあって ~がないものを削除 */
    // for (const [name, obj] of Object.entries(list)) {

    // }
    //
    { return list as CustomAttrSearchResult }
  }

  /**
   *
   */
  add (param:{
    inputElement  : string | HTMLInputElement | NodeListOf<HTMLInputElement> | HTMLInputElement[]
    rule          : string | Array< string | [ string, { [ x : string ] : any } ] >
    errorMessage? : string | { [ ruleName : string ] : string}
    errorElement? : string | HTMLElement
    event?        : string | string[]
    name?         : string
    valueFilter?  : Function | undefined
  }): InputRuleUnitType {
    // setup param.inputElement ------------------------------------------------
    if (typeof param.inputElement === 'string') { // string -> NodeList<HTMLElement>
      const _elmSelector = param.inputElement
      param.inputElement = this.form.querySelectorAll(_elmSelector)
      if (param.inputElement.length === 0) throw new Error(`inputElement parameter "${_elmSelector}" is not found in the form.`)
    }
    if (param.inputElement instanceof HTMLInputElement) { // HTMLElement -> HTMLElement[]
      param.inputElement = [param.inputElement]
    } else if (param.inputElement instanceof NodeList) { // NodeList<HTMLElement> -> HTMLElement[]
      if (param.inputElement.length === 0) throw new Error('inputElement parameter length is 0')
      const _arr:HTMLInputElement[] = []
      param.inputElement.forEach(elm => { _arr.push(elm) })
      param.inputElement = _arr
    }
    // 🤔 definitely, the param.inputElement is HTMLElement[] and it is not zero length.

    // setup param.rule --------------------------------------------------------
    // convert to..
    // [
    //   [ ruleName, option ],
    //   [ ruleName, option ]
    // ]
    if (typeof param.rule === 'string') {
      param.rule = [[param.rule, {}]]
    }
    param.rule = param.rule.map(rule => {
      return typeof rule === 'string' ? [rule, {}] : rule
    })

    // setup errorMessage ------------------------------------------------------
    if (param.errorMessage === undefined) {
      param.errorMessage = {}
    } else if (typeof param.errorMessage === 'string') {
      param.errorMessage = { default : param.errorMessage }
    }
    param.errorMessage = Object.assign({ default : 'The value has error.' }, param.errorMessage)
    // setup errorElement ------------------------------------------------------
    if (param.errorElement === undefined) {
      param.errorMessage = undefined
    } else if (typeof param.errorElement === 'string') {
      const _elmSelector = param.errorElement
      const _elm = this.form.querySelector<HTMLElement>(param.errorElement)
      if (_elm === null) throw new Error(`errorElement parameter "${_elmSelector}" is not found in the form.`)
      param.errorElement = _elm
    }

    // setup event -------------------------------------------------------------
    if (param.event === undefined) {
      param.event = []
    } else if (typeof param.event === 'string') {
      param.event = [param.event]
    }

    // setup name --------------------------------------------------------------
    if (param.name === undefined) param.name = __unitNameSeed()

    // setup tagName -----------------------------------------------------------
    const tagName = param.inputElement[0].tagName.toLowerCase()

    // setup type --------------------------------------------------------------
    let type:string = ''
    if (tagName === 'input') {
      type = param.inputElement[0].getAttribute('type')
    } else {
      type = tagName
    }
    if (
      type === 'password' || type === 'search' || type === 'tel'    ||
      type === 'email'    || type === 'url'    || type === 'number' ||
      type === 'datetime' || type === 'date'   || type === 'month'  ||
      type === 'week'     || type === 'time'   || type === 'datetime-local'
    ) type = 'text'

    // add events --------------------------------------------------------------
    param.inputElement.forEach(elem => {
      const events = param.event as string[]
      events.forEach(event => {
        elem.addEventListener(event, () => {
          this.validate(param.name)
        })
      })
    })

    const unit: InputRuleUnitType = Object.assign({}, param as InputRuleUnitType, {
      tagName,
      type,
      displayError : param.errorElement !== undefined
    })

    this.inputsRules.set(unit.name, unit)
    return unit
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
   *
   */
  getRuleUnit (ruleUnitName:string):InputRuleUnitType {
    const unit:InputRuleUnitType = this.inputsRules.get(ruleUnitName)
    if (unit === undefined) throw new Error(`${ruleUnitName} is not found.`)
    return unit
  }

  /**
   * get value from the input
   */
  getInputValue (unit:InputRuleUnitType):string {
    let value = ''
    if (unit.type === 'text') {
      value = unit.inputElement[0].value
    }
    if (unit.type === 'radio') {
      for (let i = 0, l = unit.inputElement.length; i < l; i++) {
        const elem = unit.inputElement[i]
        if (elem.checked) {
          value = elem.value
          break
        }
      }
    }
    if (unit.type === 'checkbox') {
      if (unit.inputElement[0].checked) {
        value = unit.inputElement[0].value
      }
    }
    return value
  }

  /**
   * clear errors and  message
  */
  clear (unit:InputRuleUnitType): void {
    unit.error = []
    unit.errorElement.innerHTML = ''
    if (unit.errorElement !== undefined) {
      /** @todo clear methods */
    }
  }

  /**
   *
  */
  validate (ruleUnitName:string):boolean {
    const unit = this.getRuleUnit(ruleUnitName)

    let value = this.getInputValue(unit)
    if (unit.valueFilter !== undefined) value = unit.valueFilter.bind(this)(value, Kensho)

    this.clear(unit)

    for (const [ruleName, option] of unit.rule) {
      if (!Kensho.validate(ruleName, value, option)) {
        unit.error.push(ruleName)
      }
    }

    if (unit.error.length > 0 && unit.displayError) {
      this.displayError(unit)
    }

    return unit.error.length === 0
  }

  /**
   *
   */
  displayError (unit:InputRuleUnitType):void {
    if (!unit.displayError || unit.error.length === 0) return undefined

    const errors:string[] = []
    const wrapper = Kensho.config.errorMessageWrapper
    for (const ruleName of unit.error) {
      if (ruleName === 'default') continue
      const msg:string = unit.errorMessage[ruleName] === undefined ? `The value does not meet "${ruleName}" validation rule.` : unit.errorMessage[ruleName]
      errors.push(`<${wrapper}>${msg}</${wrapper}>`)
    }
    const error = Kensho.config.verbose ? errors.join('') : `<${wrapper}>${unit.errorMessage.default}</${wrapper}>`
    unit.errorElement.innerHTML = error
  }
}

// add default rules
for (const [ruleName, callback] of Object.entries(defaultRules)) {
  Kensho.rule.add(ruleName, callback)
}

// add default plugins
for (const [pluginName, method] of Object.entries(_plugins)) {
  Kensho.plugin.add(pluginName, method)
}
