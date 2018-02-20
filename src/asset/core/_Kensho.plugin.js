(()=>{
    /**
     * @namespace Kensho.plugin
     */
    let plugin = Object.create(null);
    let list   = {};
    /**
     * Add plugins.<br>
     * You have to call before the Kensho be created a instance.
     * 
     * @method  Kensho.plugin.add
     * @version 1.0.0
     * 
     * @arg {string}   name       - A plugin name.
     * @arg {Function} func       - A plugin function.
     * @arg {Object}   [param={}] - 
     * 
     * @return {this}
     */
    plugin.add = function(name, func, param = {}){
        list[name] = {
            'name'  : name,
            'func'  : func,
            'param' : param
        };
        return this;
    }
    /**
     * remove plugins.
     * 
     * @method  Kensho.plugin.remove
     * @version 1.0.0
     * 
     * @arg {string} name - A plugin name.
     * 
     * @return {this}
     */
    plugin.remove = function(name){
        delete list[name];
        return this;
    }
    /**
     * get plugin function.
     * 
     * @method  Kensho.plugin.get
     * @version 1.0.0
     * 
     * @arg    {string} name - 
     * @return {any}         - 
     */
    plugin.get = function(name){
        return list[name];
    }

    Kensho.plugin = plugin;
})();
