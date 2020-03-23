# Kensho

The JavaScript validation library.

## what can that do

- It can validates values simply.
- It can also validates input values in the form.
- You can add your own validation rules.
- It provides any plugins. And you can also add your own plugins.

# Validation

In Kensho, It defines a validation function that called: "rule", and validates a value using that, via `Kensho.validate()` method.  

```js
Kensho.validate('email', 'private@myhost.com') // -> true
// The rule is: "email"
// The value you want to validate is 'private@myhost.com'
```

Some rules allow you to set options.

```js
Kensho.validate('regexp', 'hello', { "regexp" : /llo$/ }) // -> true
```

The Option's `type` is always `Object` .  
What option's properties each rule has, refer to the rule document.

## the Rules

### regexp

Validate the value with a regular expression.

#### option

| key    | type   |
| ------ | ------ |
| regexp | RegExp |

### email

The value is valid as an email address.

## Add your rules

You can also add your own rules using the `Kensho.rule.add()` method.  
In the example below that add a new rule `empty`.

```js
/**
 * @param {string}   ruleName
 * @param {Function} callback
 * @param {Kensho}   Kensho
 */
Kensho.rule.add('empty', (value, option, Kensho) => {
  if ( option.trim ) value = value.trim()
  return* !!value
})
```

### Callback function

Callback function has 3 arguments.

- The `value` you want to validate.
- The `option` that is structured.
- The `Kensho` is used to refer other rules or plugins in your rule.

Also, Callback function has to return boolean type.

## Plugins

### pre-installed plugins

#### half2full

#### full2half



