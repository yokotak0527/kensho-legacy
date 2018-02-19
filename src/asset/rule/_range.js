// (()=>{
//   let rule  = Kensho.rule;
//
//   /**
//    * @param {String}   val
//    * @param {Object}   [param]
//    * @param {Number}   [param.min]
//    * @param {Number}   [param.max]
//    * @param {Boolean}  [param.trim=true]
//    * @param {Boolean}  [param.undefinedThrough=false]
//    */
//   rule.add('range', function(val, param = {}){
//     let result           = true;
//     let trimFlg          = param.trim === true ? true : false;
//     let undefinedThrough = param.undefinedThrough === true ? true : false;
//     if(trimFlg) val = val.trim();
//     if ( undefinedThrough && val.length === 0 ) return true;
//
//     if(param.min === undefined && param.max === undefined) return result;
//
//     if(param.min === undefined && typeof param.max === 'number'){
//       if(val.length > param.max) result = false;
//     }
//     if(typeof param.min === 'number' && param.max === undefined){
//       if(val.length < param.min) result = false;
//     }
//     if(param.min !== undefined && param.max !== undefined){
//       if(val.length < param.min || val.length > param.max) result = false;
//     }
//     return result;
//   });
//
// })();
