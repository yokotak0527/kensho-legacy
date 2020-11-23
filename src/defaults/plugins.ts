import Kensho from '../Kensho'

const charWidthMap:{[x:string]:string} = {}
/* eslint-disable object-property-newline,quote-props */
Object.assign(charWidthMap, {
  '０' : '0', '１' : '1', '２' : '2', '３' : '3', '４' : '4',
  '５' : '5', '６' : '6', '７' : '7', '８' : '8', '９' : '9'
})
Object.assign(charWidthMap, {
  'ａ' : 'a', 'ｂ' : 'b', 'ｃ' : 'c', 'ｄ' : 'd', 'ｅ' : 'e',
  'ｆ' : 'f', 'ｇ' : 'g', 'ｈ' : 'h', 'ｉ' : 'i', 'ｊ' : 'j',
  'ｋ' : 'k', 'ｌ' : 'l', 'ｍ' : 'm', 'ｎ' : 'n', 'ｏ' : 'o',
  'ｐ' : 'p', 'ｑ' : 'q', 'ｒ' : 'r', 'ｓ' : 's', 'ｔ' : 't',
  'ｕ' : 'u', 'ｖ' : 'v', 'ｗ' : 'w', 'ｘ' : 'x', 'ｙ' : 'y',
  'ｚ' : 'z'
})
Object.assign(charWidthMap, {
  'Ａ' : 'A', 'Ｂ' : 'B', 'Ｃ' : 'C', 'Ｄ' : 'D', 'Ｅ' : 'E',
  'Ｆ' : 'F', 'Ｇ' : 'G', 'Ｈ' : 'H', 'Ｉ' : 'I', 'Ｊ' : 'J',
  'Ｋ' : 'K', 'Ｌ' : 'L', 'Ｍ' : 'M', 'Ｎ' : 'N', 'Ｏ' : 'O',
  'Ｐ' : 'P', 'Ｑ' : 'Q', 'Ｒ' : 'R', 'Ｓ' : 'S', 'Ｔ' : 'T',
  'Ｕ' : 'U', 'Ｖ' : 'V', 'Ｗ' : 'W', 'Ｘ' : 'X', 'Ｙ' : 'Y',
  'Ｚ' : 'Z'
})
Object.assign(charWidthMap, {
  '－' : '-', '（' : '(', '）' : ')', '＿' : '_', '／' : '/',
  '＋' : '+', '：' : ':', '；' : ';', '］' : ']', '［' : '[',
  '＠' : '@', '！' : '!', '＜' : '<', '＞' : '>', '？' : '?',
  '｛' : '{', '｝' : '}', '＊' : '*', '”' : '"', '’' : "'",
  '〜' : '~', '＾' : '^', '￥' : '¥', '｜' : '|', '＆' : '&',
  '％' : '%', '＃' : '#', '＄' : '$', '　' : ' ', '＝' : '='
})
/* eslint-enable object-property-newline,quote-props */

export const charWidthMapAssign: Kensho.Plugin.Store['charWidthMapAssign'] = function (map) {
  Object.assign(charWidthMap, map)
}
/**
 * half width char convert full width
 */
export const half2full: Kensho.Plugin.Store['half2full'] = function (str) {
  return str.split('').map(char => {
    let returnVal = char
    if (Kensho.use('is2byte', char)) return returnVal
    for (const [key, value] of Object.entries(charWidthMap)) {
      if (value === char) {
        returnVal = key
        break
      }
    }
    return returnVal
  }).join('')
}

/**
 * full width convert half width
 */
export const full2half: Kensho.Plugin.Store['full2half'] = function (str) {
  return str.split('').map(char => {
    let returnVal = char
    if (Kensho.use('is1byte', char)) return returnVal
    for (const [key, value] of Object.entries(charWidthMap)) {
      if (key === char) {
        returnVal = value
        break
      }
    }
    return returnVal
  }).join('')
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
export const is1byte: Kensho.Plugin.Store['is1byte'] = (char) => {
  return _isNbyte(true, char)
}
/**
 *
 */
export const is2byte: Kensho.Plugin.Store['is2byte'] = function (char) {
  return _isNbyte(false, char)
}

/**
 *
 */
export const squash: Kensho.Plugin.Store['squash'] = function (str, linebreak = false) {
  const regexp = linebreak ? /([^\S]|[\t\n])+/gm : /([^\S]|\t)+/gm
  return str.trim().replace(regexp, '')
}
