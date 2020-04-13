import { RuleTypeStore } from '@src/rule'

/**
 *
 */
export const required: RuleTypeStore['required'] = (value) => {
  if (typeof value === 'string') return value.trim() !== ''
  if (typeof value === 'number') return true
  if (Array.isArray(value)) return value.length !== 0
  if (typeof value === 'object' && value !== null) return Object.keys(value).length !== 0
  if (value === undefined) return false
  if (value === null) return false
  return true
}

/**
 *
 */
export const empty:RuleTypeStore['empty'] = (value) => {
  if (typeof value === 'string') return value === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object' && value !== null) return Object.keys(value).length === 0
  if (value === undefined) return true
  return false
}

/**
 *
 */
export const regexp: RuleTypeStore['regexp'] = (value, { regexp }) => {
  return regexp.test(value)
}

/**
 *
 */
export const email: RuleTypeStore['email'] = (value, option, Kensho) => {
  /** @see https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript */
  return Kensho.validate('regexp', value, { regexp : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })
}

/**
 *
*/
export const list: RuleTypeStore['list'] = (value, { list }, Kensho) => {
  let hit = false
  for (let i = 0, l = list.length; i < l; i++) {
    if (value instanceof RegExp) {
      hit = Kensho.validate('regexp', list[i], { regexp : value })
      if (hit) break
    } else if (value === list[i]) {
      hit = true
      break
    }
  }
  return hit
}
// export const install = () => {

// }
// // const number: RuleBaseType<string|number, {}> = (value, {}) => {
// //   let numValue: number
// //   if (typeof value === 'string') {
// //     numValue = parseInt(value, 10)
// //     if (isNaN(numValue)) return false
// //   } else {
// //     numValue = value
// //   }
// //   return true
// // }
