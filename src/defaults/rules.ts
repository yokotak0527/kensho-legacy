import { RuleStore } from '../rule'
// import { Kensho } from '@src/Kensho'

/**
 *
 */
export const required: RuleStore['required'] = value => {
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
export const empty:RuleStore['empty'] = (value) => {
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
export const regexp: RuleStore['regexp'] = (value, { regexp }) => {
  return regexp.test(value)
}

/**
 *
 */
export const email: RuleStore['email'] = (value, option, Kensho) => {
  /** @see https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript */
  return Kensho.validate('regexp', value, { regexp : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })
}

/**
 *
*/
export const list: RuleStore['list'] = (value, { list }, Kensho) => {
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
export const number: RuleStore['number'] = value => {
  if (typeof value === 'number') return true
  if (value.trim() === '') return false
  return !Number.isNaN(value as any * 1)
}

/**
 *
 */
export const integer: RuleStore['integer'] = (value, option, Kensho) => {
  if (!Kensho.validate('number', value)) return false

  if (typeof value === 'string') {
    value = parseInt(value, 10)
  }
  return value % 1 === 0
}

/**
 *
 */
export const naturalNumber: RuleStore['naturalNumber'] = (value, { zero = false }, Kensho) => {
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
export const positiveNumber: RuleStore['positiveNumber'] = (value, option, Kensho) => {
  if (!Kensho.validate('number', value)) return false

  if (typeof value === 'string') {
    value = parseInt(value, 10)
  }
  return value > 0
}

/**
 *
 */
export const negativeNumber: RuleStore['negativeNumber'] = (value, option, Kensho) => {
  if (!Kensho.validate('number', value)) return false

  if (typeof value === 'string') {
    value = parseInt(value, 10)
  }
  return value < 0
}

/**
 *
 */
export const zero: RuleStore['zero'] = (value, option, Kensho) => {
  if (!Kensho.validate('number', value)) return false

  if (typeof value === 'string') {
    value = parseInt(value, 10)
  }
  return value === 0
}

/**
 *
 */
export const age: RuleStore['age'] = (value, { max = 125 }, Kensho) => {
  if (!Kensho.validate('naturalNumber', value, { zero : true })) return false

  if (typeof value === 'string') {
    value = parseInt(value, 10)
  }
  return value <= max
}

/**
 *
 */
export const equal:RuleStore['equal'] = (value, { others, isInput = true }) => {
  let result = true
  if (typeof others === 'string') others = [others]
  for (const other of others) {
    let otherValue:string
    if (isInput) {
      otherValue = document.querySelector<HTMLInputElement>(other).value
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

export const letters:RuleStore['letters'] = (value, { range = {} }) => {
  range = Object.assign({
    min : -1,
    max : -1
  }, range)
  range.min = typeof range.min === 'string' ? parseInt(range.min, 10) : range.min
  range.max = typeof range.max === 'string' ? parseInt(range.max, 10) : range.max
  if (range.min < 0 && range.max < 0) throw new Error('To use the letters rule, you need to specify number that is 0 or more for either `range.min` or `range.max`')
  if (range.min < 0 && range.max >= 0) return value.length <= range.max
  if (range.min >= 0 && range.max < 0) return value.length >= range.min
  if (range.min > range.max) throw new Error('You cannot specify a number larger than `range.max` in `range.min`')
  if (range.min >= 0 && range.max >= 0) return value.length >= range.min && value.length <= range.max
  return false
}
