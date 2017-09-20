(()=>{

  let error  = Kensho.error;
  let plugin = Object.create(null);
  
  let _list  = {
    'class'    : {},
    'instance' : {}
  }
  /**
   *
   * addPlugin
   * 
   * | scope argument       | class                             | instance                   |
   * |----------------------|-----------------------------------|----------------------------|
   * | this                 | Kensho                            | instance                   |
   * | init. function       | once. when create first instance  | every time create instance |
   * | to refer by instance | this.classPlugin or Kensho.plugin | this.plugin                |
   * 
   * @param {string}   name            - Plugin name
   * @param {function} callback        - Initialize function. Don't use arrow function.
   * @param {object}   [param={}]      - Initialize function arguments
   * @param {string}   [scope='class'] - 'class' or 'instance'
   * 
   * @return {void}
   */
  plugin.add = function(name, callback, param = {}, scope = 'class'){
    if(_list['class'][name] || _list['instance'][name]){
      console.error(`plugin conflict ${name}`);
      return false;
    }
    if(Kensho.isInitialize()){
      console.error(`plug-in is must be added before create instance.`);
      return false;
    }
    _list[scope][name] = {
      param    : param,
      scope    : scope,
      callback : callback
    };
  }
  plugin._list = _list;

  Kensho.plugin = plugin;
})();
