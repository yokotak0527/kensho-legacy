import Kensho        from '@src/Kensho'
import { pluginBox } from '@src/plugin'

interface MyPluginStore extends Kensho.Plugin.Store {
  samplePlugin1 : () => void
}

describe('plugin control', () => {
  test('Kensho.plugin.add()', () => {
    Kensho.plugin.add('samplePlugin1', () => {return})
    const plugin = pluginBox.get('samplePlugin1')
    expect(typeof plugin).toBe('function')
  })

  test('Kensho.plugin.get()', () => {
    const plugin = Kensho.plugin.get<'samplePlugin1', MyPluginStore>('samplePlugin1')
    expect(typeof plugin).toBe('function')
  })

  test('Kensho.plugin.delete()', () => {
    Kensho.plugin.delete('samplePlugin1')

    expect(() => {
      Kensho.plugin.get('samplePlugin1')
    }).toThrow()
  })
})

describe('preinstall plugins', () => {
  test('half2full', () => {
    expect(Kensho.use('half2full', 'a')).toBe('ａ')
    expect(Kensho.use('half2full', 'A')).toBe('Ａ')
    expect(Kensho.use('half2full', '1')).toBe('１')
    expect(Kensho.use('half2full', '@')).toBe('＠')
    expect(Kensho.use('half2full', '!')).toBe('！')
    expect(Kensho.use('half2full', 'aA1@!')).toBe('ａＡ１＠！')
    expect(Kensho.use('half2full', '＠')).toBe('＠')
    expect(Kensho.use('half2full', 'あ')).toBe('あ')
    // Kensho.plugin
  })
  test('full2half', () => {
    expect(Kensho.use('full2half', 'ａ')).toBe('a')
    expect(Kensho.use('full2half', 'Ａ')).toBe('A')
    expect(Kensho.use('full2half', '１')).toBe('1')
    expect(Kensho.use('full2half', '＠')).toBe('@')
    expect(Kensho.use('full2half', '！')).toBe('!')
    expect(Kensho.use('full2half', 'ａＡ１＠！')).toBe('aA1@!')
    expect(Kensho.use('full2half', '@')).toBe('@')
  })
  test('is1byte', () => {
    expect(Kensho.use('is1byte', 'a')).toBeTruthy()
    expect(Kensho.use('is1byte', 'ａ')).toBeFalsy()
  })
  test('is2byte', () => {
    expect(Kensho.use('is2byte', 'ａ')).toBeTruthy()
    expect(Kensho.use('is2byte', 'a')).toBeFalsy()
  })
  test('squash', () => {
    expect(Kensho.use('squash', ' a ')).toBe('a')
    expect(Kensho.use('squash', 'a a a')).toBe('aaa')
    expect(Kensho.use('squash', 'a a')).toBe('aa')
    expect(Kensho.use('squash', '  a  a  ')).toBe('aa')
    expect(Kensho.use('squash', 'a　a')).toBe('aa')  // eslint-disable-line
    expect(Kensho.use('squash', 'a\na', true)).toBe('aa')
    expect(Kensho.use('squash', 'a\n\na', true)).toBe('aa')
  })
})
