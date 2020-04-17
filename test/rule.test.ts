import { Kensho } from '@src/Kensho'
import { RuleStore, RuleType, ruleBook } from '@src/rule'
type KenshoType = typeof Kensho

interface MyRuleStore extends RuleStore {
  'sample1' : RuleType<string, {}>
}

describe('rule control', () => {
  test('Kensho.rule.add()', () => {
    const sampleFunc: MyRuleStore['sample1'] = (value, option) => {
      return true
    }
    Kensho.rule.add('sample1', sampleFunc)

    const callback = ruleBook.get('sample1')
    expect(typeof callback).toBe('function')
  })

  test('Kensho.rule.get()', () => {
    const callback = Kensho.rule.get<'sample1', MyRuleStore>('sample1')
    expect(typeof callback).toBe('function')
  })

  test('Kensho.rule.delete()', () => {
    Kensho.rule.delete('sample1')

    expect(() => {
      Kensho.rule.get('sample1')
    }).toThrow()

    const callback = ruleBook.get('sample1')
    expect(callback).toBe(undefined)
  })
})

describe('default rules', () => {
  test('required', () => {
    // Kensho.validate<'sample1', MyRuleStore>('sample1', )
    expect(Kensho.validate('required', 'a')).toBeTruthy()
    expect(Kensho.validate('required', ' ')).toBeFalsy()
    expect(Kensho.validate('required', '')).toBeFalsy()
    expect(Kensho.validate('required', ['a'])).toBeTruthy()
    expect(Kensho.validate('required', [])).toBeFalsy()
    expect(Kensho.validate('required', { a:'a' })).toBeTruthy()
    expect(Kensho.validate('required', {})).toBeFalsy()
    expect(Kensho.validate('required', 0)).toBeTruthy()
    expect(Kensho.validate('required', undefined)).toBeFalsy()
    expect(Kensho.validate('required', null)).toBeFalsy()
  })
  test('empty', () => {
    expect(Kensho.validate('empty', 'a')).toBeFalsy()
    expect(Kensho.validate('empty', '')).toBeTruthy()
    expect(Kensho.validate('empty', 0)).toBeFalsy()
    expect(Kensho.validate('empty', [1])).toBeFalsy()
    expect(Kensho.validate('empty', [])).toBeTruthy()
    expect(Kensho.validate('empty', { a:1 })).toBeFalsy()
    expect(Kensho.validate('empty', {})).toBeTruthy()
    expect(Kensho.validate('empty', undefined)).toBeTruthy()
    expect(Kensho.validate('empty', null)).toBeFalsy()
  })
  test('regexp', () => {
    expect(Kensho.validate('regexp', 'hoge', { regexp : /^hoge$/ })).toBeTruthy()
    expect(Kensho.validate('regexp', 'hoge', { regexp : /fuga/ })).toBeFalsy()
  })
  test('email', () => {
    expect(Kensho.validate('email', 'a@a.com')).toBeTruthy()
    expect(Kensho.validate('email', 'a@')).toBeFalsy()
    expect(Kensho.validate('email', 'a.com')).toBeFalsy()
    expect(Kensho.validate('email', 'a@a@a.com')).toBeFalsy()
  })
  test('list', () => {
    const list = [
      'hoge',
      'fuga'
    ]
    expect(Kensho.validate('list', 'fuga', { list })).toBeTruthy()
    expect(Kensho.validate('list', 'piyo', { list })).toBeFalsy()
    expect(Kensho.validate('list', /^ho/, { list })).toBeTruthy()
    expect(Kensho.validate('list', /yo$/, { list })).toBeFalsy()
  })
  test('number', () => {
    expect(Kensho.validate('number', '10')).toBeTruthy()
    expect(Kensho.validate('number', '')).toBeFalsy()
    expect(Kensho.validate('number', 0)).toBeTruthy()
    expect(Kensho.validate('number', 1.1)).toBeTruthy()
    expect(Kensho.validate('number', -1)).toBeTruthy()
    expect(Kensho.validate('number', +1)).toBeTruthy()
  })
  test('integer', () => {
    expect(Kensho.validate('integer', '10')).toBeTruthy()
    expect(Kensho.validate('integer', '')).toBeFalsy()
    expect(Kensho.validate('integer', 0)).toBeTruthy()
    expect(Kensho.validate('integer', -1)).toBeTruthy()
    expect(Kensho.validate('integer', +1)).toBeTruthy()
    expect(Kensho.validate('integer', 1.0)).toBeTruthy()
    expect(Kensho.validate('integer', 1.1)).toBeFalsy()
    expect(Kensho.validate('integer', -1.1)).toBeFalsy()
  })
  test('naturalNumber', () => {
    expect(Kensho.validate('naturalNumber', '10')).toBeTruthy()
    expect(Kensho.validate('naturalNumber', '')).toBeFalsy()
    expect(Kensho.validate('naturalNumber', 1)).toBeTruthy()
    expect(Kensho.validate('naturalNumber', 0, { zero:true })).toBeTruthy()
    expect(Kensho.validate('naturalNumber', 0)).toBeFalsy()
    expect(Kensho.validate('naturalNumber', -1)).toBeFalsy()
    expect(Kensho.validate('naturalNumber', 1.1)).toBeFalsy()
  })
  test('positiveNumber', () => {
    expect(Kensho.validate('positiveNumber', '10')).toBeTruthy()
    expect(Kensho.validate('positiveNumber', '')).toBeFalsy()
    expect(Kensho.validate('positiveNumber', 1)).toBeTruthy()
    expect(Kensho.validate('positiveNumber', +1)).toBeTruthy()
    expect(Kensho.validate('positiveNumber', 1.1)).toBeTruthy()
    expect(Kensho.validate('positiveNumber', 0)).toBeFalsy()
    expect(Kensho.validate('positiveNumber', -1)).toBeFalsy()
  })
  test('negativeNumber', () => {
    expect(Kensho.validate('negativeNumber', '-10')).toBeTruthy()
    expect(Kensho.validate('negativeNumber', '')).toBeFalsy()
    expect(Kensho.validate('negativeNumber', -1)).toBeTruthy()
    expect(Kensho.validate('negativeNumber', -1.1)).toBeTruthy()
    expect(Kensho.validate('negativeNumber', 0)).toBeFalsy()
    expect(Kensho.validate('negativeNumber', 1)).toBeFalsy()
    expect(Kensho.validate('negativeNumber', +1)).toBeFalsy()
  })
  test('zero', () => {
    expect(Kensho.validate('zero', '0')).toBeTruthy()
    expect(Kensho.validate('zero', '')).toBeFalsy()
  })
  test('age', () => {
    expect(Kensho.validate('age', '0')).toBeTruthy()
    expect(Kensho.validate('age', '')).toBeFalsy()
    expect(Kensho.validate('age', '-1')).toBeFalsy()
    expect(Kensho.validate('age', 0)).toBeTruthy()
    expect(Kensho.validate('age', 125)).toBeTruthy()
    expect(Kensho.validate('age', 126)).toBeFalsy()
    expect(Kensho.validate('age', 0.1)).toBeFalsy()
    expect(Kensho.validate('age', 25, { max:20 })).toBeFalsy()
  })
  test('equal', () => {
    expect(Kensho.validate('equal', 'hoge', { others:'hoge' })).toBeTruthy()
    expect(Kensho.validate('equal', 'hoge', { others:['hoge', 'hoge'] })).toBeTruthy()
    expect(Kensho.validate('equal', 'hoge', { others:'fuga' })).toBeFalsy()
    expect(Kensho.validate('equal', 'hoge', { others:['hoge', 'fuga'] })).toBeFalsy()
  })
})
