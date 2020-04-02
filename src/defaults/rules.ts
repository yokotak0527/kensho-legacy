import { RuleTypeStore } from '@src/rule.d'

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
