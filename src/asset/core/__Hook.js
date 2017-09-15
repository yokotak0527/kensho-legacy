(()=>{
  let map  = new Map();
  let _get = self => map.get(self);
  
  class Hook{
    /**
     *
     * constructor
     * 
     */
    constructor(){
      // soft private
      map.set(this, Object.create(null));
      let _ = _get(this);
      _.actions = {};
      _.filters = {};
    }
    /**
     *
     * set action/filter hook
     * 
     * @param {string} type       - "action" or "filter"
     * @param {string} hookName   - 
     * @param {string} callback   - 
     * @param {number} [priority] - 
     * @return {hook} this
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
     * 
     * @param  {string} type         - 
     * @param  {string} hookName     - 
     * @param  {string} callbackName - 
     * @return {hook} this
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
     *
     * Do action hook
     * 
     * @param  {string} name       - 
     * @param  {object} [param={}] - 
     * @param  {*}      thisObject - 
     * @return {void}
     */
    action(name, param = {}, thisObject = this){
      let _       = _get(this);
      let actions = _.actions[name];
      if(actions) actions.forEach(listener => listener.callback.call(thisObject, param));
    }
    /**
     * 
     * apply filter hook
     * 
     * @param  {string} name       - 
     * @param  {*}      data       - 
     * @param  {*}      thisObject - 
     * @return {*}
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
