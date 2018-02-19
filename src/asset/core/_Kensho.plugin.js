(()=>{
    /**
     * @namespace Kensho.plugin
     */
    let plugin = Object.create(null);
    let _list  = {};
    /**
     * Add plugins.
     *
     * @method  Kensho.plugin.add
     * @version 0.0.1
     *
     * @param  {string}   name       A plugin name.
     * @param  {Function} callback   A plugin initialize function.
     * @param  {Object}   [param={}] Paramerters in order to pass to the initialize function.
     * @return {void}
     */
    plugin.add = function(name, callback, param = {}){
//     if(Kensho.isInitialize()){
//       console.error(`plug-in is must be added before create instance.`);
//       return false;
//     }
//     Kensho.plugin[name] = callback;
//     // _list[name] = {
//     //   param    : param,
//     //   callback : callback
//     // };
    }
    // plugin._list = _list;

    Kensho.plugin = plugin;
})();
