type CharWidthConvType = (str: string) => string

export const half2full: CharWidthConvType = (str) => {
  return str.split('').map(char => {
    return String.fromCharCode(char.charCodeAt(0) - 0xfee0)
  }).join()
}

export const full2half: CharWidthConvType = (str) => {
  return str
}
// const maps = {}

// Object.assign(maps, {
//   '０' : '0',
//   '１' : '1',
//   '２' : '2',
//   '３' : '3',
//   '４' : '4',
//   '５' : '5',
//   '６' : '6',
//   '７' : '7',
//   '８' : '8',
//   '９' : '9'
// })

// Object.assign(maps, {
//   ａ : 'a',
//   ｂ : 'b',
//   ｃ : 'c',
//   ｄ : 'd',
//   ｅ : 'e',
//   ｆ : 'f',
//   ｇ : 'g',
//   ｈ : 'h',
//   ｉ : 'i',
//   ｊ : 'j',
//   ｋ : 'k',
//   ｌ : 'l',
//   ｍ : 'm',
//   ｎ : 'n',
//   ｏ : 'o',
//   ｐ : 'p',
//   ｑ : 'q',
//   ｒ : 'r',
//   ｓ : 's',
//   ｔ : 't',
//   ｕ : 'u',
//   ｖ : 'v',
//   ｗ : 'w',
//   ｘ : 'x',
//   ｙ : 'y',
//   ｚ : 'z'
// })

// export default (Kensho)=>{
//   let maps = {};
//   maps = Object.assign(maps, {
//       '０' : '0', '１' : '1', '２' : '2', '３' : '3', '４' : '4',
//       '５' : '5', '６' : '6', '７' : '7', '８' : '8', '９' : '9'
//   });
//   maps = Object.assign(maps, {
//       'ａ' : 'a', 'ｂ' : 'b', 'ｃ' : 'c', 'ｄ' : 'd', 'ｅ' : 'e',
//       'ｆ' : 'f', 'ｇ' : 'g', 'ｈ' : 'h', 'ｉ' : 'i', 'ｊ' : 'j',
//       'ｋ' : 'k', 'ｌ' : 'l', 'ｍ' : 'm', 'ｎ' : 'n', 'ｏ' : 'o',
//       'ｐ' : 'p', 'ｑ' : 'q', 'ｒ' : 'r', 'ｓ' : 's', 'ｔ' : 't',
//       'ｕ' : 'u', 'ｖ' : 'v', 'ｗ' : 'w', 'ｘ' : 'x', 'ｙ' : 'y',
//       'ｚ' : 'z'
//   });
//   maps = Object.assign(maps, {
//       'Ａ' : 'A', 'Ｂ' : 'B', 'Ｃ' : 'C', 'Ｄ' : 'D', 'Ｅ' : 'E',
//       'Ｆ' : 'F', 'Ｇ' : 'G', 'Ｈ' : 'H', 'Ｉ' : 'I', 'Ｊ' : 'J',
//       'Ｋ' : 'K', 'Ｌ' : 'L', 'Ｍ' : 'M', 'Ｎ' : 'N', 'Ｏ' : 'O',
//       'Ｐ' : 'P', 'Ｑ' : 'Q', 'Ｒ' : 'R', 'Ｓ' : 'S', 'Ｔ' : 'T',
//       'Ｕ' : 'U', 'Ｖ' : 'V', 'Ｗ' : 'W', 'Ｘ' : 'X', 'Ｙ' : 'Y',
//       'Ｚ' : 'Z'
//   });
//   maps = Object.assign(maps, {
//       '－' : '-', '（' : '(', '）' : ')', '＿' : '_', '／' : '/',
//       '＋' : '+', '：' : ':', '；' : ';', '］' : ']', '［' : '[',
//       '＠' : '@', '！' : '!', '＜' : '<', '＞' : '>', '？' : '?',
//       '｛' : '{', '｝' : '}', '＊' : '*', '”' : '"', '’' : "'",
//       '〜' : '~', '＾' : '^', '￥' : '¥', '｜' : '|', '＆' : '&',
//       '％' : '%', '＃' : '#', '＄' : '$', '　' : ' ', '＝' : '='
//   });
//   let full2half = function(val){
//       let result = '';
//       val.split('').forEach((s)=>{
//           s = maps[s] ? maps[s] : s;
//           result += s;
//       });
//       return result;
//   }
//   full2half.addMap = (userMap)=>{
//       maps = Object.assign(maps, userMap);
//   }
//   Kensho.plugin.add('full2half', full2half);
// };
