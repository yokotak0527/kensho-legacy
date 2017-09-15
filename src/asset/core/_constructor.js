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
  this.hook        = new Kensho.Hook(this);
  
  // soft private
  this._ = new Map();
  this._.set(this, Object.create(null));
  Object.defineProperty(this, '_', { enumerable : false });
  let _ = this._.get(this);
  _.inputs = {};
  

  // console.log(form instanceof HTMLElement);
  formElement.classList.add('kensho-form');

  // this.hook.addAction('init');
}




// Kensho.addRule
