/**
 * Change the behavior of Kensho.
 *
 * @namespace Kensho.config
 */
let _c = {};
_c.errorMessageWrapper = 'span';
_c.verbose             = true;
_c.errorClassName      = 'kensho-has-error';
_c.autocomplete        = true;
_c.HTML5novalidate     = true;
// =============================================================================
export default {
    /**
     * get configuration value
     *
     * @version 0.0.1
     *
     * @arg {string} key configuration key name
     *
     * @return {any}
     */
    get(key){
        return _c[key];
    },
    /**
     * Set configuration value
     *
     * @version 0.0.1
     *
     * @arg {(string|Object)} key   A Configuration key name or Configurations key/value Object.<br> When you pass an object, you can set a number of configurations in bluk.
     * @arg {any}             [val] A configuration value.
     *
     * @example Kensho.config({
     *     'errorMessageWrapper' : 'p', // default is 'span'
     * });
     *
     * @return {void}
     */
    set(key, val){
        if(typeof key === 'object') for(let _k in key) this.set(_k, key[_k]);
        _c[key] = val;
    }
}
