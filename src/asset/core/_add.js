/**
 * 
 * Add validation field.
 *
 * About of [event=['']] param.
 * it fundamentally set event.type name.
 * but, it has especial names, as follows.
 *   init - when in add() method
 * 
 * @param {string|HTMLElement|array<HTMLElement>} inputElement - Form input HTML element or its CSS selector string.
 * @param {string|HTMLElement}                    errorElement - Wrapper element of output error message or its CSS selector string.
 * @param {object}                                rule         - The key is rule name. The value is error message.
 * @param {string|<string>}                       [event=['']] - trigger event.
 * @return {Kensho} this
 */
add(inputElement, errorElement, rule, event = [''], param = {}){

  // for example, name attribute of radio buttons are seted same value.
  // querySelector return matched first HTML element and 2nd and subsequent matched element is ignored.
  // so, InputElement not use querySelector but use querySelectorAll.
  // as a result of it, inputElement type is a array.
  inputElement = typeof inputElement === 'string' ? document.querySelectorAll(inputElement) : Array.isArray(inputElement) ? inputElement : [inputElement];
  errorElement = typeof errorElement === 'string' ? document.querySelector(errorElement) : errorElement;
  event        = typeof event        === 'string' ? [event] : event;

  let _       = this._.get(this);
  let name    = inputElement[0].getAttribute('name');
  let tagName = inputElement[0].tagName.toLowerCase();
  let type    = null;
  if(tagName === 'input') type = inputElement[0].getAttribute('type');
  else type = tagName;
  if(type !== 'radio') inputElement = inputElement[0];

  let _rule = {};
  for(let key in rule){
    if(typeof rule[key] === 'string'){
      _rule[key] = {
        param        : {},
        errorMessage : rule[key]
      };
    }else{
      _rule[key] = rule[key];
    }
  }
  rule = _rule;

  let unit = {
    name         : name,
    inputElement : inputElement,
    errorElement : errorElement,
    inputTagName : tagName,
    type         : type,
    rule         : rule,
    error        : []
  }

  unit = this.hook.filter('validate-filed', unit, this);
  _.inputs[name] = unit;

  // Add event handler
  event.forEach((name, i)=>{
    if(name === 'init'){
      if(unit.type === 'radio'){
        unit.inputElement.forEach((input, i)=>{
          this.validate(unit.name);
        });
      }else{
        this.validate(unit.name);
      }
    }else{
      if(unit.type === 'radio'){
        unit.inputElement.forEach((input, i)=>{
          input.addEventListener(name, ()=>{
            this.validate(unit.name);
          });
        });
      }else{
        unit.inputElement.addEventListener(name, ()=>{
          this.validate(unit.name);
        });
      }
    }
  });

  this.hook.action('set-validate-field', {unit : unit}, this);
  return this;
}
