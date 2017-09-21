(()=>{
  let initialized = false;
  /**
   * initialization
   * 
   * @method  Kensho.init
   * @version 0.0.1
   * 
   * @return {void}
   */
  Kensho.init = ()=>{
    initialized = true;
  };
  /**
   * return true or false whether class initialization was processed.
   * 
   * @method  Kensho.isInitialize
   * @version 0.0.1
   * 
   * @return {Boolean}
   */
  Kensho.isInitialize = ()=> initialized;
})();
