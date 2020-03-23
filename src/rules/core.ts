import { FunctionType } from '@src/rule'

/**
 *
 */
export const regexp: FunctionType<string, {regexp: RegExp}> = (value, { regexp }) => {
  return regexp.test(value)
}

/**
 *
 */
export const email: FunctionType<string, {}> = (value, option, Kensho) => {
  /** @see https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript */
  return Kensho.validate('regexp', value, { regexp : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })
}

/**
 *
 */
export const list: FunctionType<string, {list: string}> = (value: string, { list }, Kensho) => {
  let hit = false
  for (let i = 0, l = list.length; i < l; i++) {
    if (value === list[i]) {
      hit = true
      break
    }
  }
  return hit
}

/**
 *
 */
// type numberOptionType = {
//   only
// }
// export const number: FunctionType = (value: string|number, option: {}, Kensho) => {
//   if (typeof value === 'number') {

//   } else {

//   }
// }
