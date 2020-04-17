import { PluginStore } from '../plugin'

/**
 * half width char convert full width
 */
export const half2full: PluginStore['half2full'] = (str) => {
  return str.split('').map(char => {
    return String.fromCharCode(char.charCodeAt(0) - 0xfee0)
  }).join()
}

/**
 * full width convert half width
 */
export const full2half: PluginStore['full2half'] = (str) => {
  return str.split('').map(char => {
    return String.fromCharCode(char.charCodeAt(0) - 0xfee0)
  }).join()
}

const _isNbyte = (half: boolean, char: string): boolean => {
  /** enable eslint */
  const code = char.charCodeAt(0)
  const f    = (code >= 0x0 && code < 0x81) || (code === 0xf8f0) || (code >= 0xff61 && code < 0xffa0) || (code >= 0xf8f1 && code < 0xf8f4)
  return half ? f : !f
}
/**
 *
 */
export const is1byte: PluginStore['is1byte'] = (char) => {
  return _isNbyte(true, char)
}
/**
 *
 */
export const is2byte: PluginStore['is2byte'] = (char) => {
  return _isNbyte(false, char)
}
