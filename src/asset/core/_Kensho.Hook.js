(()=>{
  let map  = new Map();
  let _get = self => map.get(self);

  class Hook{
    /**
     * @constructs Kensho.Hook
     */
    constructor(){
      // soft private
      map.set(this, Object.create(null));
      let _ = _get(this);
      _.actions = {};
      _.filters = {};
    }
    /**
     * add action/filter hook
     * 
     * @version 0.0.1
     * 
     * @param {string} type         - this hook type name. "action" or "filter"
     * @param {string} hookName     - the target hook name
     * @param {string} callbackName - callback name
     * @param {string} callback     - 
     * @param {number} [priority]   - a priority of to do callback
     * @return {hook}               - instance
     */
    add(type, hookName, callbackName, callback, priority = false){
      let _ = _get(this);
      let hooks;
      switch(type){
        case 'action' :
          hooks = _.actions;
          break;
        case 'filter' :
          hooks = _.filters;
          break;
      }
      if(!hooks[hookName]) hooks[hookName] = [];
      hooks = hooks[hookName];
      
      let newHook = {
        name     : callbackName,
        callback : callback
      }
      if(priority === false){
        hooks.push(newHook);
      }else{
        hooks.splice(priority, 0, newHook);
      }
      return this;
    }
    /**
     * remove action/filter hook
     * 
     * @version 0.0.1
     * 
     * @param  {string} type         - this hook type name. "action" or "filter"
     * @param  {string} hookName     - the target hook name
     * @param  {string} callbackName - callback name
     * @return {hook}                - instance
     */
    remove(type, hookName, callbackName){
      let _ = _get(this);
      let hooks;
      let typeName;
      switch(type){
        case 'action' :
          typeName = 'actions';
          hooks = _.actions;
          break;
        case 'filter' :
          typeName = 'filters';
          break;
      }
      hooks = _[typeName][hookName];
      if(hooks){
        hooks = hooks.filter((hook)=>{
          return hook.name !== callbackName;
        });
        _[typeName][hookName] = hooks;
      }
      return this;
    }
    /**
     * do action hook
     * 
     * @version 0.0.1
     * 
     * @param  {string} name       - hook name
     * @param  {object} [param={}] - in order to pass to the callbacks
     * @param  {*}      thisObject - to bind "this" object. default is Hook instance
     * @return {void}
     */
    action(name, param = {}, thisObject = this){
      let _       = _get(this);
      let actions = _.actions[name];
      if(actions) actions.forEach(listener => listener.callback.call(thisObject, param));
    }
    /**
     * apply filter hook
     * 
     * @version 0.0.1
     * 
     * @param  {string} name       - hook name
     * @param  {*}      data       - data to be filterd
     * @param  {*}      thisObject - to bind "this" object. default is Hook instance
     * @return {*}                 - a filtered data
     */
    filter(name, data, thisObject = this){
      let _       = _get(this);
      let filters = _.filters[name];
      if(filters){
        filters.forEach((listener)=>{
          data = listener.callback.call(thisObject, data);
        });
      };
      return data;
    }
  }
  Kensho.Hook = Hook;
})();
