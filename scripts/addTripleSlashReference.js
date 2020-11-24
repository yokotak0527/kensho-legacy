const fs = require('fs')

const file = '@types/Kensho.d.ts'
const text = Buffer.from('/// <reference types="./@types/" />\n')
const data = fs.readFileSync(file)
const fd   = fs.openSync(file, 'w+')

fs.writeSync(fd, text, 0, text.length, 0)
fs.writeSync(fd, data, 0, data.length, text.length)