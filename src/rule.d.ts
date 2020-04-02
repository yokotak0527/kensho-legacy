import { Kensho } from '@src/Kensho'
type KenshoType = typeof Kensho

export type RuleType<V, O extends Object> = (value: V, option: O, Kensho: KenshoType) => boolean

export interface RuleTypeStore {
  'regexp': RuleType<string, { regexp: RegExp }>
  'email': RuleType<string, {}>
  'list': RuleType<string | RegExp, { list: string[] }>
}
