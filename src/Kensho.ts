import { rule, RuleTypeStore, RuleType } from '@src/rule'
import { plugin }         from '@src/plugin'
import config             from '@src/config'
import * as _rules        from '@src/defaults/rules'
import * as _plugins      from '@src/defaults/plugins'

const defaultRules = _rules as RuleTypeStore

export interface InputRuleUnitType {
  name         : string
  inputElement : HTMLElement[]
  errorElement : HTMLElement
  errorMessage : {[x:string]: string}
}

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
    inputElement: string | HTMLElement | NodeListOf<HTMLElement> | HTMLElement[],
    errorElement: string | HTMLElement | undefined,
    rule        : {name:keyof RuleTypeStore, option?:object} | Array<{name:keyof RuleTypeStore, option?:object}>,
    event       : string | string[] = [''],
    unitName = ''
  ): void {
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
    // definitely, the inputElement type is HTMLElement[] and it is not zero length.

    if (typeof errorElement === 'string') {
      const _elmSelector = errorElement
      const _elm = this.form.querySelector<HTMLElement>(errorElement)
      if (_elm === null) throw new Error(`errorElement "${_elmSelector}" is not found in the form.`)
      errorElement = _elm
    }

    if (!Array.isArray(rule)) rule = [rule]
    // this structure is {name:string, option?:object}[]

    if (typeof event === 'string') event = [event]

    // const name    = unitName ?? inputElement[0].getAttribute('name') ?? ''
    // const tagName = inputElement[0].tagName.toLowerCase()

    // let type = '' // this
    // if (tagName === 'input') {
    //   type = inputElement[0].getAttribute('type') ?? ''
    // } else {
    //   type = tagName
    // }

    // the following types are handled as text type
    // if (
    //   type === 'password' || type === 'search' || type === 'tel'    ||
    //   type === 'email'    || type === 'url'    || type === 'number' ||
    //   type === 'datetime' || type === 'date'   || type === 'month'  ||
    //   type === 'week'     || type === 'time'   || type === 'datetime-local'
    // ) type = 'text'

    // errorElement = typeof errorElement === 'string' ? this.form.querySelector(errorElement)    : errorElement
    // errorElement = typeof errorElement === 'string' ? this.formElement.querySelector(errorElement)    : errorElement;
    // event        = typeof event        === 'string' ? event.split('|') : !event ? [''] : event;
    // inputElement = this.formElement.querySelectorAll(inputElement);
    // inputElement = Array.prototype.map.call(inputElement, v => v );
    // }else if( Array.isArray(inputElement) ){
    // let arr = [];
    // inputElement.forEach( val => {
    // val = typeof val === 'string' ? this.formElement.querySelectorAll(val) : val;
    // val = Array.prototype.map.call(val, v => v );
    // val.forEach( v => { arr.push(v) });
    // });
    // inputElement = arr;
    // }else{
    // inputElement = Array.prototype.map.call(inputElement, v => v );
    // }
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

// declare interface 'RuleTypeStore' {

// export interface CustomType {

//   customField: string;

//   customMethod(arg1: number, arg2: boolean): boolean;
// }

// namespace customNamespace {

//   export interface AnotherCustomType {
//     customField1: string;
//     customField2: boolean;
//   }
// }

// // NOTE: extending existing interface
// export interface KnockoutStatic {
//   customMethod(): void;
// }
// }
declare interface RuleTypeStore {
  'regexp' : string
  // 't':string

}
type T = keyof RuleTypeStore
// interface RuleTypeStore {
//   't2':string
// }
// interface I2 {
//   'str1' : string
// }
// interface I2 {
//   'str2' : string
// }
type T = keyof RuleTypeStore
// interface
// type RuleTypeStore = RuleTypeStore

// type T = keyof RuleTypeStore
// // interface RuleTypeStore {
// //
// // }
// const k = new Kensho('form')
// k.add('input', 'errorInput', { name:'test' })
