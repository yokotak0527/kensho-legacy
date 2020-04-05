module.exports = {
  compilationOptions : {
    preferredConfigPath: './tsconfig.json'
  },
  entries: [
    {
      filePath: './src/Kensho.ts',
      outFile: './dist/bundle.d.ts',
    }
  ]
}
