/**
 * Hook class
 *
 * @class Hook
 * @classdesc This class offer action and filter hooks function.<br>And this class not global.
 * @see Kensho#hook
 */
class Hook{
    constructor(){
        this.actions = {};
        this.filters = {};
    }
    /**
     * Add "action" or "filter" hooks.
     *
     * @version 0.0.1
     * @memberof Hook
     * @instance
     *
     * @arg {string} type          - It hook types. "action" or "filter"
     * @arg {string} hookName      - The target hook name
     * @arg {string} callbackName  - The callback name
     * @arg {string} callback      -
     * @arg {number} [priority=-1] - A priority of to act this callback
     *
     * @return {this}
     */
    add(type, hookName, callbackName, callback, priority = -1){
        let hooks;

        switch(type){
            case 'action' :
                hooks = this.actions;
                break;
            case 'filter' :
                hooks = this.filters;
                break;
        }

        if(!hooks[hookName]) hooks[hookName] = [];

        let newCallback = {
            name     : callbackName,
            callback : callback
        }
        if(priority < 0){
            hooks[hookName].push(newCallback);
        }else{
            hooks[hookName].splice(priority, 0, newCallback);
        }
        return this;
    }
    /**
     * Remove "action" or "filter" hooks.
     *
     * @version 0.0.1
     * @memberof Hook
     * @instance
     *
     * @param  {string} type         - It hook types. "action" or "filter"
     * @param  {string} hookName     - the target hook name
     * @param  {string} callbackName - callback name
     *
     * @return {this}
     */
    remove(type, hookName, callbackName){
        let hooks;

        switch(type){
            case 'action' :
                hooks = this.actions;
                break;
            case 'filter' :
                hooks = this.filters;
                break;
        }

        try{
            hooks[hookName] = hooks[hookName].filter((hook)=>{
                return hook.name !== callbackName;
            });
            if(!hooks[hookName].length) delete hooks[hookName];
        }catch(e){
            console.error(e);
        }
        return this;
    }
    /**
     * Do action hooks.
     *
     * @version 0.0.1
     * @memberof Hook
     * @instance
     *
     * @param  {string} name       - hook name
     * @param  {Object} [param={}] - in order to pass to the callbacks
     * @param  {*}      thisObject - to bind "this" object. default is Hook instance
     *
     * @return {void}
     */
    action(hookName, param = {}, thisObject = this){
        let callbacks = this.actions[hookName];
        if(callbacks) callbacks.forEach(listener => listener.callback.call(thisObject, param));
    }
    /**
     * Apply filter hooks.
     *
     * @version 0.0.1
     * @memberof Hook
     * @instance
     *
     * @param  {string} name       - hook name
     * @param  {*}      data       - data to be filterd
     * @param  {*}      thisObject - to bind "this" object. default is Hook instance
     *
     * @return {*}
     */
    filter(hookName, data, thisObject = this){
        let callbacks = this.filters[hookName];
        if(callbacks){
            callbacks.forEach((listener)=>{
                data = listener.callback.call(thisObject, data);
            });
        };
        return data;
    }
}

export default Hook;
