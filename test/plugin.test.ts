import { Kensho } from '@src/Kensho'
import { PluginStore, pluginBox } from '@src/plugin'
type KenshoType = typeof Kensho

interface MyPluginStore extends PluginStore {
  samplePlugin1():void
}

describe('plugin control', () => {
  test('Kensho.plugin.add()', () => {
    Kensho.plugin.add('samplePlugin1', () => {})
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
    // Kensho.plugin
  })
})
// describe('preinstall plugins', () => {
//   // test('half2full', () => {
//   //   // Kensho.plugin.
//   // })
// //   test('regexp', () => {
// //     expect(Kensho.validate('regexp', 'hoge', { regexp : /^hoge$/ })).toBeTruthy()
// //     expect(Kensho.validate('regexp', 'hoge', { regexp : /fuga/ })).toBeFalsy()
// //   })
// //   test('email', () => {
// //     expect(Kensho.validate('email', 'a@a.com')).toBeTruthy()
// //     expect(Kensho.validate('email', 'a@')).toBeFalsy()
// //     expect(Kensho.validate('email', 'a.com')).toBeFalsy()
// //     expect(Kensho.validate('email', 'a@a@a.com')).toBeFalsy()
// //   })
// })
