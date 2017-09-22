(()=>{
  let _c = {};
  _c.errorMessageWrapper = 'span';
  _c.verbose             = true;
  _c.errorClassName      = 'kensho-has-error';

  /**
   * Kensho configuration.
   * 
   * @namespace Kensho.config
   */
  Kensho.config = {
    /**
    * get configuration value
    *
    * @method Kensho.config.get
    * 
    * @param {String} key configuration key name
    * @return {*}         key value
    */
    get(key){
      return _c[key];
    },
    /**
     * Set configuration value
     * 
     * @param {(String|Object)} key configuration key name. when you pass an object, you can set a number of configurations in bluk.
     * @return {void}
     */
    set(key, val){
      if(typeof key === 'object') for(let _k in key) this.set(_k, key[_k]);
      _c[key] = val;
    }
  }
  
})();
