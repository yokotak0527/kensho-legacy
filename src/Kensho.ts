// import { rule, RuleStore, RuleType, GetRuleType } from './rule'
import { rule, RuleStore, RuleType } from './rule'
import { plugin, PluginStore }       from './plugin'
import config                        from './config'
import * as _rules                   from './defaults/rules'
import * as _plugins                 from './defaults/plugins'

type InputElementTypes = HTMLInputElement | HTMLSelectElement
interface CustomAttrSearchResult { [name:string] : { input : InputElementTypes, error? : HTMLElement } }
interface AddFunctionParamArg {
  inputElement  : string | InputElementTypes | NodeListOf<HTMLInputElement> | InputElementTypes[]
  rule          : string | Array< string | [ string, { [ x : string ] : any } ] >
  errorMessage? : string | { [ ruleName : string ] : string}
  errorElement? : string | HTMLElement
  event?        : string | string[]
  name?         : string
  valueFilter?  : Function | undefined
}
type _F = (...args:any) => any

const defaultRules = _rules as RuleStore

export interface InputRuleUnitType {
  inputElement  : InputElementTypes[]
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
    const plugin = Kensho.plugin.get(pluginName).bind(Kensho)
    return plugin(...args)
  }

  /**
   *
   */
  constructor (formSelector: string|HTMLElement, option:{search?:boolean} = {}) {
    option = Object.assign({
      search : true
    }, option)

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

    if (option.search) { this.addFromCustomAttrs(this.search()) }

    return this
  }

  /**
   *
   */
  addFromCustomAttrs (CustomAttrs:CustomAttrSearchResult):void {
    const attrPrefix = Kensho.config.customAttrPrefix
    for (const [unitName, data] of Object.entries(CustomAttrs)) {
      if (this.inputsRules.get(unitName) !== undefined) throw new Error(`The "${unitName}" rule unit is already exsisted.`)

      const _inputElm = data.input

      const name = unitName
      const errorElement = data.error

      // parse rule ------------------------------------------------------------
      const rawRule:AddFunctionParamArg['rule'] | null = _inputElm.getAttribute(`${attrPrefix}rule`)
      if (rawRule === null) throw new Error(`The \`k-rule\` attribute is not found in the element where \`k-name="${unitName}"\` is specified.`)
      const rule = this.parseAttrStr2Arr<Exclude<AddFunctionParamArg['rule'], string>>(rawRule)

      // parse inputElement ----------------------------------------------------
      let inputElement:InputElementTypes | NodeListOf<HTMLInputElement> = data.input
      const typeAttr = data.input.getAttribute('type')
      if (typeAttr === 'radio') {
        inputElement = this.form.querySelectorAll<HTMLInputElement>(`input[name="${data.input.getAttribute('name')}"]`)
      }

      // parse event -----------------------------------------------------------
      let rawEvent:AddFunctionParamArg['event'] | undefined = _inputElm.getAttribute(`${attrPrefix}event`) !== null ? _inputElm.getAttribute(`${attrPrefix}event`) : undefined
      if (typeof rawEvent === 'string') {
        rawEvent = this.parseAttrStr2Arr<Exclude<AddFunctionParamArg['event'], string>>(rawEvent)
      }
      const event = rawEvent

      // parse eventMessage ----------------------------------------------------
      let rawErrorMessage:AddFunctionParamArg['errorMessage'] | undefined = _inputElm.getAttribute(`${attrPrefix}message`) !== null ? _inputElm.getAttribute(`${attrPrefix}message`) : undefined
      if (typeof rawErrorMessage === 'string') {
        rawErrorMessage = rawErrorMessage
          .trim()
          .replace(/\n/gm, '')
          .replace(/'/g, '"')
        if (/^{.+}$/.test(rawErrorMessage)) {
          rawErrorMessage = JSON.parse(rawErrorMessage) as Exclude<AddFunctionParamArg['errorMessage'], string>
        }
      }
      const errorMessage = rawErrorMessage

      // parse filter ----------------------------------------------------------
      type RawFilter = string | undefined | Array<string | [ string, any[] ]>
      let rawFilter:RawFilter = _inputElm.getAttribute(`${attrPrefix}filter`) !== null ? _inputElm.getAttribute(`${attrPrefix}filter`) : undefined
      let valueFilter:AddFunctionParamArg['valueFilter']
      if (typeof rawFilter === 'string') {
        rawFilter = this.parseAttrStr2Arr<Exclude<RawFilter, string | undefined>>(rawFilter)
        // console.log(rawFilter)
        valueFilter = function (value, Kensho) {
          for (const filter of rawFilter) {
            if (typeof filter === 'string') {
              value = Kensho.use(filter, value)
            } else {
              value = Kensho.use(filter[0], value, ...filter[1])
            }
          }
          return value
        }
      }

      const addParam:AddFunctionParamArg = {
        inputElement,
        errorElement,
        errorMessage,
        rule,
        event,
        valueFilter,
        name
      }

      this.add(addParam)
    }
  }

  /**
   *
   */
  search ():CustomAttrSearchResult {
    const prefix = Kensho.config.customAttrPrefix
    const match = this.form.querySelectorAll(`*[${prefix}name]`)

    const _list:{ [x:string] : { input? : InputElementTypes, error? : HTMLElement } } = {}

    for (const item of match) {
      let name = item.getAttribute(`${prefix}name`)
      const type = /\.error$/.test(name) ? 'error' : 'input'
      if (type === 'error') {
        name = name.replace('.error', '')
      }
      if (_list[name] === undefined) {
        _list[name] = {}
      }
      if (type === 'input') {
        if (_list[name].input !== undefined) {
          console.error(`There are two or more \`k-name\` attributes of the same value. "${name}"`)
        }
        _list[name].input = item as InputElementTypes
      } else if (type === 'error') {
        if (_list[name].error !== undefined) {
          console.error(`There are two or more \`k-name\` attributes of the same value. "${name}.error"`)
        }
        _list[name].error = item as HTMLElement
      }
    }

    const list:CustomAttrSearchResult = {}
    for (const [name, obj] of Object.entries(_list)) {
      if (obj.input !== undefined) {
        list[name] = obj as { input : InputElementTypes, error : HTMLElement }
      } else {
        console.error(`No \`k-name="${name}"\` attribute in HTML input form against \`k-name="${name}.error"\``)
      }
    }
    //
    return list
  }

  /**
   *
   */
  add (param:AddFunctionParamArg): InputRuleUnitType {
    // setup param.inputElement ------------------------------------------------
    if (typeof param.inputElement === 'string') { // string -> NodeList<HTMLElement>
      const _elmSelector = param.inputElement
      param.inputElement = this.form.querySelectorAll(_elmSelector)
      if (param.inputElement.length === 0) throw new Error(`inputElement parameter "${_elmSelector}" is not found in the form.`)
    }

    if (param.inputElement instanceof HTMLInputElement) { // HTMLInputElement -> HTMLInputElement[]
      param.inputElement = [param.inputElement]
    } else if (param.inputElement instanceof HTMLSelectElement) { // HTMLSelectElement -> HTMLSelectElement[]
      param.inputElement = [param.inputElement]
    } else if (param.inputElement instanceof NodeList) { // NodeList<HTMLInputElement> -> HTMLInputElement[]
      if (param.inputElement.length === 0) throw new Error('inputElement parameter length is 0')
      const _arr:HTMLInputElement[] = []
      param.inputElement.forEach(elm => { _arr.push(elm) })
      param.inputElement = _arr
    }
    // console.log(param.inputElement)
    // 🤔 definitely, the param.inputElement is Array<HTMLElement|HTMLSelectElement> and it is not zero length.

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
      error : [],
      displayError : param.errorElement !== undefined
    })

    this.inputsRules.set(unit.name, unit)
    return unit
  }

  /**
   *
   */
  hasError (): boolean {
    let hasError = false
    this.inputsRules.forEach((val, key) => {
      if (val.error.length > 0) hasError = true
    })
    return hasError
  }

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
        const elem = unit.inputElement[i] as HTMLInputElement
        if (elem.checked) {
          value = elem.value
          break
        }
      }
    }
    if (unit.type === 'checkbox') {
      const elem = unit.inputElement[0] as HTMLInputElement
      if (elem.checked) {
        value = elem.value
      }
    }
    if (unit.type === 'select') {
      const elem = unit.inputElement[0] as HTMLSelectElement
      value = elem.options[elem.options.selectedIndex].value
    }
    return value
  }

  /**
   * clear errors and message
  */
  clear (unit:InputRuleUnitType): void {
    unit.error = []
    if (unit.displayError) {
      unit.errorElement.innerHTML = ''
    }
  }

  /**
   *
   */
  allClear ():void {
    this.inputsRules.forEach((val, key) => this.clear(this.getRuleUnit(key)))
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
  allValidate ():void {
    this.inputsRules.forEach((val, key) => this.validate(key))
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
      const msg:string = unit.errorMessage[ruleName] === undefined ? `The value failed "${ruleName}" validation rule.` : unit.errorMessage[ruleName]
      errors.push(`<${wrapper}>${msg}</${wrapper}>`)
    }
    const error = Kensho.config.verbose ? errors.join('') : `<${wrapper}>${unit.errorMessage.default}</${wrapper}>`
    unit.errorElement.innerHTML = error
  }

  /**
   *
  */
  private parseAttrStr2Arr<N> (value:string):N {
    value = value.trim()
      .replace(/\s*([0-9a-z\-_]+)\s*,/gmi, '\'$1\',') // "hoge, ['fuga', {}], piyo" -> "'hoge', ['fuga', {}], piyo"
      .replace(/\s*([0-9a-zA-Z\-_]+)$/, '\'$1\'') // "'hoge', ['fuga', {}], piyo" -> "'hoge', ['fuga', {}], 'piyo'"
      .replace(/\/(.+)\/([gimsuy]*)/, '"/$1/$2"') // escape regexp
    value = `[${value}]`
      .replace(/'/g, '"')

    const returnVal:N = JSON.parse(value).map(elem => this.parseString2rightType(elem))
    return returnVal
  }

  /**
   *
   */
  private parseString2rightType (val:any):any {
    if (Array.isArray(val)) {
      val = val.map(v => this.parseString2rightType(v))
    } else if (typeof val === 'object') {
      for (const key in val) {
        val[key] = this.parseString2rightType(val[key])
      }
    } else if (typeof val === 'string') {
      const match = (val.match(/(\/.+\/)([gimsuy]*)/))
      if (match !== null) {
        match[1] = match[1].replace(/^\//, '').replace(/\/$/, '')
        val = match[2] === '' ? new RegExp(match[1]) : new RegExp(match[1], match[2])
      }
    }
    return val
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
