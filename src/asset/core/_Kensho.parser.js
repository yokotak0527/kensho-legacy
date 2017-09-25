(()=>{

  let parser = {};
  parser.parse = function(formElement, inputElement){
    console.log(formElement);
    return true;
  }

  Kensho.parser = parser;
})();
