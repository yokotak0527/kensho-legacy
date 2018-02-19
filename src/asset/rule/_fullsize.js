// (()=>{
//   let rule  = Kensho.rule;
//
//   /**
//    * @param {String} val
//    * @param {Object} [param={}]
//    */
//   rule.add('fullsize', function(val, param = {}){
//     let result = true;
//
//     for(let i = 0, l = val.length; i < l; i++){
//       if(!Kensho.plugin.is2byte(val[i])){
//         result = false;
//         break;
//       };
//     }
//     return result;
//   });
//
// })();
