(()=>{

  /**
   *
   * 
   */
  // Kensho.plugin.add('2to1', function(){
  //   return function(){
  //   }
  // }, {}, 'class');


  // Kensho.plugin.add('test1', function(){
  //   return function(){}
  // }, {}, 'class');

  // Kensho.plugin.add('test2', function(){
  //   console.log(this);
  //   this.hook.add('action', 'init', 'test1', function(){
  //     console.log("init");
  //   });
  //   // let obj = {
  //   //   a : 2
  //   // }
  //   // return function(){
  //   //   
  //   // }
  // }, {}, 'instance');
  // /**
  //  *
  //  * transform 2byte charactor to 1byte charactor.
  //  * 
  //  * @param  {string} val -
  //  * @return {string}
  //  */

  let byte_2to1 = function(val){
  }
  byte_2to1.addMap = (map)=>{
    this._userMaps.push(map);
  }

  Kensho.plugin.add('2to1', function(){
    return byte_2to1
  }, {}, 'class');

  //   let map = {};
  //   map = Object.assign(map, {
  //     '０' : '0', '１' : '1', '２' : '2', '３' : '3', '４' : '4',
  //     '５' : '5', '６' : '6', '７' : '7', '８' : '8', '９' : '9'
  //   });
  //   map = Object.assign(map, {
  //     'ａ' : 'a', 'ｂ' : 'b', 'ｃ' : 'c', 'ｄ' : 'd', 'ｅ' : 'e',
  //     'ｆ' : 'f', 'ｇ' : 'g', 'ｈ' : 'h', 'ｉ' : 'i', 'ｊ' : 'j',
  //     'ｋ' : 'k', 'ｌ' : 'l', 'ｍ' : 'm', 'ｎ' : 'n', 'ｏ' : 'o',
  //     'ｐ' : 'p', 'ｑ' : 'q', 'ｒ' : 'r', 'ｓ' : 's', 'ｔ' : 't',
  //     'ｕ' : 'u', 'ｖ' : 'v', 'ｗ' : 'w', 'ｘ' : 'x', 'ｙ' : 'y',
  //     'ｚ' : 'z'
  //   });
  //   map = Object.assign(map, {
  //     'Ａ' : 'A', 'Ｂ' : 'B', 'Ｃ' : 'C', 'Ｄ' : 'D', 'Ｅ' : 'E',
  //     'Ｆ' : 'F', 'Ｇ' : 'G', 'Ｈ' : 'H', 'Ｉ' : 'I', 'Ｊ' : 'J',
  //     'Ｋ' : 'K', 'Ｌ' : 'L', 'Ｍ' : 'M', 'Ｎ' : 'N', 'Ｏ' : 'O',
  //     'Ｐ' : 'P', 'Ｑ' : 'Q', 'Ｒ' : 'R', 'Ｓ' : 'S', 'Ｔ' : 'T',
  //     'Ｕ' : 'U', 'Ｖ' : 'V', 'Ｗ' : 'W', 'Ｘ' : 'X', 'Ｙ' : 'Y',
  //     'Ｚ' : 'Z'
  //   });
  //   map = Object.assign(map, {
  //     '－' : '-', '（' : '(', '）' : ')', '＿' : '_', '／' : '/',
  //     '＋' : '+', '：' : ':', '；' : ';', '］' : ']', '［' : '[',
  //     '＠' : '@', '！' : '!', '＜' : '<', '＞' : '>', '？' : '?',
  //     '｛' : '{', '｝' : '}', '＊' : '*', '”' : '"', '’' : "'",
  //     '〜' : '~', '＾' : '^', '￥' : '¥', '｜' : '|', '＆' : '&',
  //     '％' : '%', '＃' : '#', '＄' : '$', '　' : ' ', '＝' : '='
  //   });
  //   let result = '';
  //   val.split('').forEach((s)=>{
  //     s = map[s] ? map[s] : s;
  //     result += s;
  //   });
  //   return result;
  // }
  // plugin.byte_2to1._userMaps = [];
  // /**
  //  *
  //  * add user 2byte to 1byte charactors map.
  //  * 
  //  * @param {object} map - The key is 2byte charactor. The value is 1byte charactor.
  //  */
  // plugin.byte_2to1.addMap = (map)=>{
  //   this._userMaps.push(map);
  // }
  // 
  // let plugin = Kensho.plugin;
})();
