(()=>{
  let initialized = false;
  /**
   * 
   */
  Kensho.init = ()=>{
    initialized = true;
  };
  /**
   * 
   * @return {Boolean}
   */
  Kensho.isInitialize = ()=> initialized;
})();
