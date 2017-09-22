(()=>{
  /**
   * @namespace Kensho.plugin
   */
  let plugin = Object.create(null);
  let _list  = {};
  /**
   * add plugin
   *
   * <div class="nonte">
   *   <table>
   *     <thead>
   *       <tr>
   *         <td></td><th>class</th><th>instance</th>
   *       </tr>
   *     </thead>
   *     <tbody>
   *       <tr>
   *         <th>this</th>
   *         <td>Kensho</td>
   *         <td>instance</td>
   *       </tr><tr>
   *         <th>init. function</th>
   *         <td>once. when create first instance</td>
   *         <td>every time create instance</td>
   *       </tr><tr>
   *         <th>to refer by instance</th>
   *         <td>this.classPlugin or Kensho.plugin</td>
   *         <td>this.plugin </td>
   *       </tr>
   *     </tbody>
   *   </table>
   * </div>
   * 
   * @method  Kensho.plugin.add
   * @version 0.0.1
   *
   * @param  {String}   name       plug-in name.
   * @param  {Function} callback   plug-in initialize function.
   * @param  {Object}   [param={}] paramerters in order to pass to the initialize function.
   * @return {void}
   */
  plugin.add = function(name, callback, param = {}){
    if(_list[name]){
      console.error(`plug-in ${name} is conflict`);
      return false;
    }
    if(Kensho.isInitialize()){
      console.error(`plug-in is must be added before create instance.`);
      return false;
    }
    Kensho.plugin[name] = callback;
    // _list[name] = {
    //   param    : param,
    //   callback : callback
    // };
  }
  plugin._list = _list;

  Kensho.plugin = plugin;
})();
