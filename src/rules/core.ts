import { RuleFunctionType } from '@src/rule'

/**
 *
 */
export const regexp: RuleFunctionType = (value: string, option: {regexp: RegExp}) => {
  return option.regexp.test(value)
}
