// (()=>{
//   let rule  = Kensho.rule;
//
//   /**
//    * @param {String}  val
//    * @param {Object}  [param={}]
//    * @param {Boolean} [param.allow2byte=false]
//    * @param {Number}  [param.maxAge=125]
//    * @param {Boolean} [param.trim=false]
//    */
//   rule.add('age', function(val, param = {}){
//     let maxAge        = param.maxAage             ? param.maxAage : 125;
//     let allow2byteFlg = param.allow2byte === true ? true : false;
//     let trimFlg       = param.trim       === true ? true : false;
//
//     if(allow2byteFlg) val = Kensho.plugin.full2half(val);
//     if(trimFlg) val = val.trim();
//
//     if(!/^[0-9]{1,3}$/.test(val)) return false;          // ex. a1,1234, -5
//     if(val.length !== 1 && /^0/.test(val)) return false; // first number is 0
//     if(val > maxAge) return false;                       // limit
//     return true;
//   }, ['number']);
//
// })();
