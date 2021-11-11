import rule          from './rule'
import { plugin }    from './plugin'
import config        from './config'

import { rules as _rules, plugins as defaultPlugins } from './defaults'

type PluginStore = Kensho.Plugin.Store
type RuleStore   = Kensho.Rule.Store
type AnyFunction = Kensho.AnyFunction

interface AddParams <F=AnyFunction>{
  inputElement  : string | Kensho.InputElementTypes | NodeListOf<HTMLInputElement> | Kensho.InputElementTypes[]
  rule          : string | Array< string | [ string, { [ x : string ] : any } ] >
  errorMessage? : string | { [ ruleName : string ] : string}
  errorElement? : string | HTMLElement
  event?        : string | string[]
  name?         : string
  allowEmpty?   : boolean
  valueFilter?  : F
}

const defaultRules = _rules as RuleStore

const _unitNameSeed_ = (() => {
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
class Kensho {
  // Props
  public           form                       : HTMLFormElement
  public           defaultAutoComplete        : string
  public           defaultHasAutoCompleteAttr : boolean
  public           isDestroyed                : boolean
  private readonly ruleUnits                  : Map<string, Kensho.RuleUnit>
  static           config                     : Kensho.Config         = config
  static           rule                       : Kensho.Rule.Methods   = rule
  static           plugin                     : Kensho.Plugin.Methods = plugin

  /**
   * validate the value
   */
  static validate<N extends string, S extends RuleStore = RuleStore, F = N extends keyof S ? S[N] : AnyFunction, A extends any[] = F extends AnyFunction ? Parameters<F> : never> (rulename:N, value:A[0], option:A[1]) :boolean
  static validate<N extends string, S extends RuleStore = RuleStore, F = N extends keyof S ? S[N] : AnyFunction, A extends any[] = F extends AnyFunction ? Parameters<F> : never> (rulename:N, value:A[0]) :boolean
  static validate (ruleName:string, ...args:any[]): boolean {
    if (args[1] === undefined) {
      return rule.get(ruleName)(args[0], {}, Kensho)
    } else {
      return rule.get(ruleName)(args[0], args[1], Kensho)
    }
  }

  /**
   * use plugin
   */
  static use<NAME extends string, STORE extends PluginStore = PluginStore, FUNC = NAME extends keyof STORE ? STORE[NAME] : AnyFunction> (pluginName:NAME, ...args: FUNC extends AnyFunction ? Parameters<FUNC> : any):FUNC extends AnyFunction ? ReturnType<FUNC> : any {
    const plugin = Kensho.plugin.get(pluginName).bind(Kensho)
    return plugin(...args as any, Kensho)
  }

  // use<N extends string, S extends PluginStore = PluginStore, F = N extends keyof S ? S[N] : _F> (...args:Parameters<Kensho.use<N, S, F>>) {
  //   return Kensho.use(...args)
  // }
  /**
   *
   */
  constructor (formSelector:string | HTMLFormElement, option:{ search?: boolean } = {}) {
    this.isDestroyed = false

    option = Object.assign({
      search : true
    }, option)

    if (typeof formSelector === 'string') {
      const _form = document.querySelector<HTMLFormElement>(formSelector)
      if (_form === null) throw new Error(`form "${formSelector}" is not found.`)
      formSelector = _form
    }
    this.form = formSelector

    { // autocomplete setup
      this.defaultHasAutoCompleteAttr = this.form.getAttribute('autocomplete') !== null ? true : false
      this.defaultAutoComplete = this.form.autocomplete
  
      if (!Kensho.config.autocomplete) {
        this.form.setAttribute('autocomplete', 'off')
        this.form.autocomplete = 'off'
      }
    }

    this.ruleUnits = new Map()
    this.form.classList.add('kensho-form')

    if (option.search) { this.addFromUnitElements(this.search()) }

    return this
  }
  /**
   * 
   */
  destroy ():void {
    this.form.autocomplete = this.defaultAutoComplete
    if (this.defaultHasAutoCompleteAttr) {
      this.form.setAttribute('autocomplete', this.defaultAutoComplete)
    } else {
      this.form.removeAttribute('autocomplete')
    }
    this.form.classList.remove('kensho-form')
    this.removeAll()
    this.isDestroyed = true
  }
  /**
   * add unit rules from the Kensho.RuleUnitElements
   */
  addFromUnitElements (inputElmsData:Kensho.RuleUnitElements):void {
    const prefix = Kensho.config.customAttrPrefix
    for (const [unitName, data] of Object.entries(inputElmsData)) {
      if (this.ruleUnits.get(unitName) !== undefined) throw new Error(`The "${unitName}" rule unit is already exsisted.`)

      const _inputElm = data.input

      const name = unitName
      const errorElement = data.error

      // parse rule ------------------------------------------------------------
      const rawRule:AddParams['rule'] | null = _inputElm.getAttribute(`${prefix}rule`)
      if (rawRule === null) throw new Error(`The \`${prefix}rule\` attribute is not found in the element where \`${prefix}name="${unitName}"\` is specified.`)
      const rule = this.parseAttrString2Array<Exclude<AddParams['rule'], string>>(rawRule)

      // parse inputElement ----------------------------------------------------
      let inputElement:Kensho.InputElementTypes | NodeListOf<HTMLInputElement> = data.input
      const typeAttr = data.input.getAttribute('type')
      if (typeAttr === 'radio') {
        inputElement = this.form.querySelectorAll<HTMLInputElement>(`input[name="${data.input.getAttribute('name')}"]`)
      }
      if (typeAttr === 'checkbox') {
        inputElement = this.form.querySelectorAll<HTMLInputElement>(`input[name="${data.input.getAttribute('name')}"]`)
      }

      // parse event -----------------------------------------------------------
      const strEvents = _inputElm.getAttribute(`${prefix}event`)
      let rawEvent:string | string[] | undefined = strEvents !== null ? strEvents : undefined
      if (typeof rawEvent === 'string') {
        rawEvent = this.parseAttrString2Array<Exclude<AddParams['event'], string>>(rawEvent)
      }
      const event = rawEvent
  
      // parse allows ----------------------------------------------------------
      const strAllowEmpty = _inputElm.getAttribute(`${prefix}allowempty`)

      // <... k-allowempty="on">, <... k-allowempty="true">, <... k-allowempty>
      const allowEmpty = strAllowEmpty === 'on' || strAllowEmpty === 'true' || strAllowEmpty === '' ? true : false

      // parse eventMessage ----------------------------------------------------
      const strMessage = _inputElm.getAttribute(`${prefix}message`)
      let rawErrorMessage:AddParams['errorMessage'] | undefined = strMessage !== null ? strMessage : undefined
      if (typeof rawErrorMessage === 'string') {
        rawErrorMessage = rawErrorMessage
          .trim()
          .replace(/\n/gm, '')
          .replace(/'/g, '"')
          .replace(/\\/, '\\\\')
          .replace(/\\\\"/g, '\'')
        if (/^{.+}$/.test(rawErrorMessage)) {
          rawErrorMessage = JSON.parse(rawErrorMessage) as Exclude<AddParams['errorMessage'], string>
        }
      }
      const errorMessage = rawErrorMessage

      // parse filter ----------------------------------------------------------
      type RawFilter = string | Array<string | [ string, any[] ]>
      const strFilter = _inputElm.getAttribute(`${prefix}filter`)
      let rawFilter:RawFilter = strFilter !== null ? strFilter : ''
      let valueFilter:AddParams['valueFilter']
      if (typeof rawFilter === 'string') {
        rawFilter = this.parseAttrString2Array<Exclude<RawFilter, string | undefined>>(rawFilter)
        valueFilter = function (value:any, Kensho: any) {
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

      this.add({
        inputElement,
        errorElement,
        errorMessage,
        rule,
        event,
        valueFilter,
        name,
        allowEmpty
      })
    }
  }

  /**
   * search named input elements in the form
   */
  search ():Kensho.RuleUnitElements {
    const prefix = Kensho.config.customAttrPrefix
    const match  = this.form.querySelectorAll(`*[${prefix}name]`)

    const _list:Kensho.RuleUnitElements = {}

    for (const item of match) {
      let name = item.getAttribute(`${prefix}name`) as string
      const type = /\.error$/.test(name) ? 'error' : 'input'
      if (type === 'error') {
        name = name.replace('.error', '')
      }
      if (_list[name] === undefined) {
        _list[name] = {} as any
      }
      if (type === 'input') {
        if (_list[name].input !== undefined) {
          throw new Error(`There are two or more \`k-name\` attributes of the same value. "${name}"`)
        }
        _list[name].input = item as Kensho.InputElementTypes
      } else if (type === 'error') {
        if (_list[name].error !== undefined) {
          throw new Error(`There are two or more \`k-name\` attributes of the same value. "${name}.error"`)
        }
        _list[name].error = item as HTMLElement
      }
    }

    const list:Kensho.RuleUnitElements = {}
    for (const [name, obj] of Object.entries(_list)) {
      if (obj.input !== undefined) {
        list[name] = obj as Kensho.RuleUnitElements['']
      } else {
        throw new Error(`No \`k-name="${name}"\` attribute in HTML input form against \`k-name="${name}.error"\``)
      }
    }
    return list
  }

  /**
   * add a rule unit
   */
  add (param:AddParams): Kensho.RuleUnit {
    // setup param.inputElement ------------------------------------------------
    if (typeof param.inputElement === 'string') { // string -> NodeList<HTMLElement>
      const _elmSelector = param.inputElement
      param.inputElement = this.form.querySelectorAll(_elmSelector)
      if (param.inputElement.length === 0) throw new Error(`inputElement parameter "${_elmSelector}" is not found in the form.`)
    }

    if (
      param.inputElement instanceof HTMLInputElement ||
      param.inputElement instanceof HTMLTextAreaElement
    ) { // HTMLInputElement -> HTMLInputElement[]
      param.inputElement = [param.inputElement]
    } else if (param.inputElement instanceof HTMLSelectElement) { // HTMLSelectElement -> HTMLSelectElement[]
      param.inputElement = [param.inputElement]
    } else if (param.inputElement instanceof NodeList) { // NodeList<HTMLInputElement> -> HTMLInputElement[]
      if (param.inputElement.length === 0) throw new Error('inputElement parameter length is 0')
      const _arr:HTMLInputElement[] = []
      param.inputElement.forEach(elm => { _arr.push(elm) })
      param.inputElement = _arr
    }
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
    if (param.name === undefined) param.name = _unitNameSeed_()

    // setup allows ------------------------------------------------------------
    param.allowEmpty = param.allowEmpty ? true : false

    // setup tagName -----------------------------------------------------------
    const tagName = param.inputElement[0].tagName.toLowerCase()

    // setup type --------------------------------------------------------------
    let type = ''
    if (tagName === 'input') {
      type = param.inputElement[0].getAttribute('type') || 'text'
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
    // const eventHandlers:{[key:string]:(...args:any)=>void} = {}
    const eventHandlers:Kensho.RuleUnit['eventHandlers'] = []
    param.inputElement.forEach((elem, elemNum) => {
      const events = param.event as string[]
      eventHandlers[elemNum] = {}
      const handlers = eventHandlers[elemNum]
      events.forEach(event => {
        handlers[`kenshoEventHandler__${event}`] = () => {
          this.validate(param.name as string)
        }
        elem.addEventListener(event, handlers[`kenshoEventHandler__${event}`])
      })
    })

    const unit = Object.assign({}, param, {
      tagName,
      type,
      error : [],
      eventHandlers,
      displayError : param.errorElement !== undefined
    }) as Kensho.RuleUnit

    this.ruleUnits.set(unit.name, unit)
    return unit
  }
  /**
   * remove a rule unit
   */
  remove (ruleUnitName:string):void {
    const unit = this.getRuleUnit(ruleUnitName)

    // delete event handler
    unit.inputElement.forEach((elem, elemNum) => {
      unit.event.forEach(eventName => {
        elem.removeEventListener(eventName, unit.eventHandlers[elemNum][`kenshoEventHandler__${eventName}`])
      })
    })
    this.ruleUnits.delete(ruleUnitName)
  }
  /**
   * 
   */
  removeAll ():void {
    const names:string[] = []
    this.ruleUnits.forEach(unit => {
      names.push(unit.name)
    })
    names.forEach(name => {
      this.remove(name)
    })
  }
  /**
   *
   */
  hasError ():boolean {
    let hasError = false
    this.ruleUnits.forEach((val) => {
      if (val.error.length > 0) hasError = true
    })
    return hasError
  }

  /**
   * get the rule unit by the rule unit name
   */
  getRuleUnit (ruleUnitName:string):Kensho.RuleUnit {
    const unit = this.ruleUnits.get(ruleUnitName)
    if (unit === undefined) throw new Error(`${ruleUnitName} is not found.`)
    return unit
  }

  /**
   * get value from the input
   */
  getInputValue (unit:Kensho.RuleUnit):string|string[] {
    let value:string|string[] = ''
    if (unit.type === 'textarea') {
      value = unit.inputElement[0].value
    }
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

      const valueArray:string[] = []
      for (let i = 0, l = unit.inputElement.length; i < l; i++) {
        const elem = unit.inputElement[i] as HTMLInputElement
        if (elem.checked) valueArray.push(elem.value)
      }
      value = valueArray
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
  clear (unit:Kensho.RuleUnit):void {
    unit.error = []
    if (unit.displayError) {
      if (unit.errorElement) {
        unit.errorElement.innerHTML = ''
      }
    }
  }

  /**
   *
   */
  clearAll ():void {
    this.ruleUnits.forEach((val, key) => this.clear(this.getRuleUnit(key)))
  }

  /**
   *
   */
  validate (ruleUnitName:string):boolean {
    const unit = this.getRuleUnit(ruleUnitName)

    let value = this.getInputValue(unit)
    if (unit.valueFilter !== undefined) {
      if (typeof value === 'string') {
        value = unit.valueFilter.bind(this)(value, Kensho)
      }
      if (Array.isArray(value)) {
        value = value.map(v => unit.valueFilter?.bind(this)(v, Kensho))
      }
    }

    this.clear(unit)

    for (const [ruleName, option] of unit.rule) {
      if (ruleName !== 'required' && unit.allowEmpty && value === '') continue
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
  validateAll ():void {
    this.ruleUnits.forEach((val, key) => this.validate(key))
  }

  /**
   * display error message
   */
  displayError ({ errorElement, displayError, errorMessage, ...unit }:Kensho.RuleUnit):void {
    if (!errorElement || !displayError || unit.error.length === 0 || !errorMessage) return

    const errors:string[] = []
    const wrapper = Kensho.config.errorMessageWrapper
    const errorItemClassName = Kensho.config.errorItemClassName

    for (const ruleName of unit.error) {
      if (ruleName === 'default') continue
      const msg:string = errorMessage[ruleName] === undefined ? `The value failed "${ruleName}" validation rule.` : errorMessage[ruleName]
      errors.push(`<${wrapper} class="${errorItemClassName}">${msg}</${wrapper}>`)
    }
    const error = Kensho.config.verbose ? errors.join('') : `<${wrapper} class="${errorItemClassName}">${errorMessage.default}</${wrapper}>`
    errorElement.innerHTML = error
  }

  /**
   * convert a string as value of HTML attribute to an array
   */
  private parseAttrString2Array<N> (value:string):N {
    value = value.trim()
      .replace(/\s*([0-9a-z\-_]+)\s*,/gmi, '\'$1\',') // "hoge, ['fuga', {}], piyo"   -> "'hoge', ['fuga', {}], piyo"
      .replace(/\s*([0-9a-zA-Z\-_]+)$/, '\'$1\'')     // "'hoge', ['fuga', {}], piyo" -> "'hoge', ['fuga', {}], 'piyo'"
      .replace(/\/(.+)\/([gimsuy]*)/, '"/$1/$2"')     // escape regexp
      .replace(/\\/g, '\\\\')                         // escape backslash
    value = `[${value}]`
      .replace(/'/g, '"')
      .replace(/\\\\"/g, '\'')

    const returnVal:N = JSON.parse(value).map((elem:any) => this.parseString2RightType(elem))
    return returnVal
  }

  /**
   *
   */
  private parseString2RightType (val:any):any {
    if (Array.isArray(val)) {
      val = val.map(v => this.parseString2RightType(v))
    } else if (typeof val === 'object') {
      for (const key in val) {
        val[key] = this.parseString2RightType(val[key])
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

export default Kensho

// add default rules
for (const [ruleName, callback] of Object.entries(defaultRules)) {
  Kensho.rule.add(ruleName, callback)
}

// // add default plugins
for (const [pluginName, method] of Object.entries(defaultPlugins)) {
  Kensho.plugin.add(pluginName, method)
}