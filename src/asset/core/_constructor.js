/**
 *
 * @param  {string|HTMLElement} formElement             - 
 * @param  {object}             [option={}]             - 
 * @param  {string}             [option.errorWrap=span] - 
 * @return {Kensho}
 */
constructor(formElement, option = {}){
  if(Kensho.isInitialize) Kensho.init();
  formElement = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;

  this.formElement = formElement;
  this.rule        = Kensho.rule;
  // this.plugin      = Kensho.plugin;
  this.hook        = new Kensho.Hook();
  // this.plugin
  
  // soft private
  this._ = new Map();
  this._.set(this, Object.create(null));
  Object.defineProperty(this, '_', { enumerable : false });
  let _ = this._.get(this);
  _.inputs = {};
  

  // console.log(form instanceof HTMLElement);
  formElement.classList.add('kensho-form');

  // this.hook.add('action', 'init', 'test1', function(){
  //   console.log("1");
  // });
  // this.hook.add('action', 'init', 'test2', function(){
  //   console.log("2");
  // }).remove('action', 'init', 'test2');
  // 
  // this.hook.action('init', function(){
  //   console.log(this);
  // }, {}, this);
}




// Kensho.addRule
