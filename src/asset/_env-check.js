// NodeJS
if(typeof process !== "undefined" && typeof require !== "undefined"){
  module.exports = Kensho;
}
// Browser
else{
  window.Kensho = Kensho;
}
