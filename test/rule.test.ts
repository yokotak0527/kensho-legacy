import { Kensho } from '@src/Kensho'
import { ruleBook } from '@src/rule'

describe('rule control', () => {
  test('Kensho.rule.add()', () => {
    Kensho.rule.add('sampleRule', <T=string>(value: T) => {
      return true
    })
    const callback = ruleBook.get('sampleRule')
    expect(typeof callback).toBe('function')
  })
  test('Kensho.rule.get()', () => {
    const callback = Kensho.rule.get('sampleRule')
    expect(typeof callback).toBe('function')
  })
  test('Kensho.rule.delete()', () => {
    Kensho.rule.delete('sampleRule')
    const callback = Kensho.rule.get('sampleRule')
    expect(callback).toBe(undefined)
  })
})
