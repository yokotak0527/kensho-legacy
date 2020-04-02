type CharWidthConvType = (str: string) => string

export const half2full: CharWidthConvType = (str) => {
  return str.split('').map(char => {
    return String.fromCharCode(char.charCodeAt(0) - 0xfee0)
  }).join()
}

export const full2half: CharWidthConvType = (str) => {
  return str
}
