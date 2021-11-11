// import Kensho from '../Kensho'

/**
 *
 */
export const required:Kensho.Rule.Store['required'] = value => {
  if (Array.isArray(value))                        return value.map(v => required(v)).includes(true)
  if (typeof value === 'string')                   return value.trim() !== ''
  if (typeof value === 'number')                   return true
  if (Array.isArray(value))                        return value.length !== 0
  if (typeof value === 'object' && value !== null) return Object.keys(value).length !== 0
  if (value === undefined || value === null)       return false
  return true
}

/**
 *
 */
export const empty:Kensho.Rule.Store['empty'] = (value) => {
  if (typeof value === 'string') return value === ''
  if (typeof value === 'number') return false
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object' && value !== null) return Object.keys(value).length === 0
  if (value === undefined) return true
  return false
}

/**
 *
 */
export const regexp: Kensho.Rule.Store['regexp'] = (value, { regexp }) => {
  return regexp.test(value)
}

/**
 *
 */
export const email: Kensho.Rule.Store['email'] = (value, option, Kensho) => {
  /** @see https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript */
  return Kensho.validate('regexp', value, { regexp : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })
}

/**
 *
*/
export const list: Kensho.Rule.Store['list'] = (value, { list }, Kensho) => {
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

/**
 *
 */
export const number: Kensho.Rule.Store['number'] = value => {
  if (typeof value === 'number') return true
  if (value.trim() === '') return false
  return !Number.isNaN(value as any * 1)
}

/**
 *
 */
export const integer: Kensho.Rule.Store['integer'] = (value, option, Kensho) => {
  if (!Kensho.validate('number', value)) return false

  if (typeof value === 'string') {
    value = parseInt(value, 10)
  }
  return value % 1 === 0
}

/**
 *
 */
export const naturalNumber: Kensho.Rule.Store['naturalNumber'] = (value, { zero = false }, Kensho) => {
  if (!Kensho.validate('integer', value)) return false

  if (typeof value === 'string') {
    value = parseInt(value, 10)
  }
  if (zero && value === 0) return true
  return value > 0
}

/**
 *
 */
export const positiveNumber: Kensho.Rule.Store['positiveNumber'] = (value, option, Kensho) => {
  if (!Kensho.validate('number', value)) return false

  if (typeof value === 'string') {
    value = parseInt(value, 10)
  }
  return value > 0
}

/**
 *
 */
export const negativeNumber: Kensho.Rule.Store['negativeNumber'] = (value, option, Kensho) => {
  if (!Kensho.validate('number', value)) return false

  if (typeof value === 'string') {
    value = parseInt(value, 10)
  }
  return value < 0
}

/**
 *
 */
export const zero: Kensho.Rule.Store['zero'] = (value, option, Kensho) => {
  if (!Kensho.validate('number', value)) return false

  if (typeof value === 'string') {
    value = parseInt(value, 10)
  }
  return value === 0
}

/**
 *
 */
export const age: Kensho.Rule.Store['age'] = (value, { max = 125 }, Kensho) => {
  if (!Kensho.validate('naturalNumber', value, { zero : true })) return false

  if (typeof value === 'string') {
    value = parseInt(value, 10)
  }
  return value <= max
}

/**
 *
 */
export const equal:Kensho.Rule.Store['equal'] = (value, { others, isInput = true }) => {
  let result = true
  if (typeof others === 'string') others = [others]
  for (const other of others) {
    let otherValue:string
    if (isInput) {
      const element = document.querySelector<HTMLInputElement>(other)
      if (!element) {
        result = false
        break
      }
      otherValue = element.value
    } else {
      otherValue = other
    }
    if (value !== otherValue) {
      result = false
      break
    }
  }
  return result
}

/**
 * 
 */
export const letters:Kensho.Rule.Store['letters'] = (value, { range = {} }) => {
  type FixRange = Required<{ [key in keyof typeof range] : string|number }>
  const fixRange:FixRange = Object.assign({ min : -1, max : -1 }, range) as FixRange

  fixRange.min = typeof fixRange.min === 'string' ? parseInt(fixRange.min, 10) : fixRange.min
  fixRange.max = typeof fixRange.max === 'string' ? parseInt(fixRange.max, 10) : fixRange.max

  if (fixRange.min <  0 && fixRange.max < 0)  throw new Error('To use the letters rule, you need to specify number that is 0 or more for either `range.min` or `range.max`')
  if (fixRange.min <  0 && fixRange.max >= 0) return value.length <= fixRange.max
  if (fixRange.min >= 0 && fixRange.max < 0)  return value.length >= fixRange.min
  if (fixRange.min >  fixRange.max)           throw new Error('You cannot specify a number larger than `range.max` in `range.min`')
  if (fixRange.min >= 0 && fixRange.max >= 0) return value.length >= fixRange.min && value.length <= fixRange.max
  return false
}
