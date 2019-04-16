# Jsosrm
> A simple JavaScript Object Structurer Retriever and Mapper

[![NPM Version][npm-image]][npm-url]

## What it does?

When your system acts as a medium of data exchange between an insecure source and a protected target, Jsosrm helps to define schematic structure for the incoming object from the source, ensures the structure passes through a layer of validations and forwards a transformed structured output to the target. Vice-versa, when Jsosrm is provided with the secured data from target, it retrieves the original source structure. That way the source and the target need not be aware of each other.

<!-- image -->

## Where can it be applied?

Jsosrm is modeled to behave like the traditional ORM, except it does not have a concept of queries and is framework agnostic, database agnostic. Hence, it fits as middleware in any system.

<!-- list examples here -->

## Installation

```sh
npm install jsosrm --save
```

## Usage and examples

Jsosrm provides four classes that can be imported:

```js
import {ValidatorBaseClass, SetterBaseClass, GetterBaseClass, ParserBaseClass} from 'Jsosrm'
```

ValidatorBaseClass, SetterBaseClass, and GetterBaseClass are utility classes. 

### _instance_.listAll()

Lists key and description of all in-built and custom _instance_ utility methods

```js
console.log(getter.listAll())
/* asBoolean => converts literals to boolean type
asNumber => converts literal to Number type
asJson => returns JSON parsed input
asLower => converts input to lower case
asUpper => converts input to upper case
dateAsString => converts input to date string
maskCardNumbers => masks all digits except the last 4*/
```
<!-- state likewise can be used for validator and setter -->

### _instance_.push(key, impl, desc)

Add a custom utility function to the instance

- *key* - key to identify the utility method
- *impl* - definition of the utility method
- *desc* - description of the utility method

For ValidatorBaseClass instances, the utilty function takes a value as input, validates constraints we define and accordingly returns true or false

```js
let validator = new ValidatorBaseClass()
validator.push('myCustomValidator', function (val) {
    // write your constraints that the val should satisfy
    // if any of your constraints is not met, indicate the validation failed
    // return false
    // else the val is valid
    // return true
    return /\*/.test(val)
}, 'validates that the input contains atleast one *')
```

For SetterBaseClass and GetterBaseClass instances, the utility function takes a value as input, transforms it as per our definitions and returns the new value

```js
let setter = new SetterBaseClass()
setter.push('myCustomSetter', function (val) {
    // write your transformations here
    // and return the new value
    return val.replace(/[^a-zA-Z]/g, '')
}, 'remove non word characters from the input')
```

*Note*: _the new method will replace an existing utility method with the same key in the instance_ 
### _instance_.pushAll()


### _instance_.isValidUtilKey(utilKey)

returns true if _instance_ has the _utilKey_, else throws an error

<!-- what key to verify below, is maskCardNumbers defined above ? -->
```js
console.log(getter.isValidUtilKey('maskCardNumbers'))
// true
console.log(getter.isValidUtilKey('anyRandomKey'))
// Error: Unknown utility key provided
```

### _instance_.asyncExec()


### _instance_.exec()



## Meta

Distributed under the XYZ license. See ``LICENSE`` for more information.

[https://github.com/mohitsorde/Jsosrm](https://github.com/mohitsorde/Jsosrm)

## Contributing

1. Fork it (<https://github.com/mohitsorde/Jsosrm/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
[npm-url]: https://npmjs.org/package/datadog-metrics