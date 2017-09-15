(()=>{
  let map  = new Map();
  let _get = self => map.get(self);
  
  class Hook{
    /**
     * [constructor description]
     * @param  {Kensho} kensho - instance of Kensho
     * @return {[type]} [description]
     */
    constructor(kensho){
      this.kensho  = kensho;
      this.actions = [];
      this.filters = [];
      
      map.set(this, Object.create(null));
      
      
      let _ = _get(this);
      // console.log(_);
    }
    /**
     * Do hook action
     * @param  {string} name - to do hook name
     * @return {void}
     */
    setAction(name){
      
    }
    /**
     * Do hook filter
     * @param  {string} name - to do hook name
     * @return {*}
     */
    setFilter(name){
      
    }
  }
  Kensho.Hook = Hook;
})();
