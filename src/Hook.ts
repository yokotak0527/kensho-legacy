import { Kensho } from './Kensho'

export type HookNames =
  'filter::getInputValue::after'

export class Hook {
  filterMap: Map<string, any>
  actionMap: Map<string, any>
  /**
   *
   */
  constructor (kensho:Kensho) {
    this.filterMap = new Map()
    this.actionMap = new Map()
  }

  /**
   *
   */
  add ():void{

  }

  /**
   *
   */
  remove ():void{

  }

  /**
   *
   */
  // filter<V, R = undefined> (name:string, value:V): R extends undefined ? V : R {
  //   const filters = this.filterMap.get(name)
  //   if (filters === undefined) return value
  // }
}
