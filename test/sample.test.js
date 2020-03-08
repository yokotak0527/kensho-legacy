const Kensho = require('../dist/bundle.cjs.js')

test('regexp', () => {
  const kensho = new Kensho()
  kensho.validate('regexp', 'hogehoge', { pattern : '/^hogehoge$/' })
  // const result = Kensho.validate('regexp', 'hogehoge', { pattern : '/^hogehoge$/' })
  // expect(result).toBe(true)
})

// Kensho.addRule
// Kensho.addRule('test', () => {
//   console.log('dddd')
// })
// console.log(Kensho.validate())
// console.log(Kensho)
