/**
 *
 * @param  {string|HTMLElement} formElement             - 
 * @param  {object}             [option={}]             - 
 * @param  {string}             [option.errorWrap=span] - 
 * @return {Kensho}
 */
constructor(formElement, option = {}){
  if(Kensho.isInitialize) Kensho.init();

  if(Kensho.instanceList === undefined) Kensho.instanceList = [this];
  else Kensho.instanceList.push(this);

  formElement = typeof formElement === 'string' ? document.querySelector(formElement) : formElement;

  this.formElement = formElement;
  this.rule        = Kensho.rule;
  this.plugin      = Object.create(null);
  this.classPlugin = Kensho.plugin;
  this.hook        = new Kensho.Hook();

  // soft private
  this._ = new Map();
  this._.set(this, Object.create(null));
  Object.defineProperty(this, '_', { enumerable : false });
  let _ = this._.get(this);
  _.inputs = {};

  // plugin setup
  if(Kensho.instanceList.length === 1){
    for(let key in Kensho.plugin._list.class){
      let cb    = Kensho.plugin._list.class[key].callback;
      let param = Kensho.plugin._list.class[key].param;
      Kensho.plugin[key] = cb.call(Kensho, param);
    }
  };
  for(let key in Kensho.plugin._list.instance){
    let cb    = Kensho.plugin._list.instance[key].callback;
    let param = Kensho.plugin._list.instance[key].param;
    this.plugin[key] = cb.call(this, param);
  }

  formElement.classList.add('kensho-form');

  this.hook.action('init', {}, this);
}




// Kensho.addRule
