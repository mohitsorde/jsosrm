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

Instances of ValidatorBaseClass, SetterBaseClass, and GetterBaseClass provide in-built utilities. ALso, custom utilities for each instance can be defined. The constructor does not take any arguments.

```js
let validator = new ValidatorBaseClass()
let setter = new SetterBaseClass()
let getter = new GetterBaseClass()
```

To consume or manipulate the utilities, the instances are provided with the following functions:

 - [exec](#exec)
 - [asyncExec](#asyncExec)
 - [push](#push)
 - [pushAll](#pushAll)
 - [listAll](#listAll)
 - [isValidUtilKey](#isValidUtilKey)

### <a name="exec">
**_instance_.exec(value, arrayOfUtilKeys)**
</a>

chain multiple instance utility methods on an input value

- *_value_* - input to be processed
- *_arrayOfUtilKeys_* - array of keys of instance utility methods to be executed in order on input value

In case of ValidatorBaseClass instances, returns false at the first validation that fails or true if all pass

```js
let isValid = validator.exec('testValue', [
    'isString',
    'alphabetical',
    // ... use listAll to know in-built methods
    'myCustomValidator',
    // ... any in-built or custom validator methods defined for the instance using push or pushAll
]) 
// returns true or false
```

In case of SetterBaseClass and GetterBaseClass, the value is transformed as per each utility method and final value is returned

```js
let outputValue = setter.exec('<script src="http://malware-..." />', [
    'htmlEncode',
    'toUpper',
    // ... use listAll to know in-built methods
    'myCustomSetter',
    // ... any in-built or custom validator methods defined for the instance using push or pushAll
])
```

### <a name="asyncExec">
**_instance_.asyncExec(value, arrayOfUtilKeys)**
</a>

chain multiple instance utility methods, including any asynchronous methods on an input value and return a promise

- *_value_* - input to be processed
- *_arrayOfUtilKeys_* - array of keys of instance utility methods to be executed in order on input value

In case of ValidatorBaseClass instances, returns promise resolving to false at the first validation that fails or to true if all pass

```js
let isValid = validator.exec('testValue', [
    'isString',
    'alphabetical',
    // ... use listAll to know in-built methods
    'myAsyncCustomValidator',
    // ... any custom or async validator methods defined for the instance using push or pushAll
]) 
// returns true or false
```

In case of SetterBaseClass and GetterBaseClass, the value is transformed as per each utility method and promise that resolves to final value is returned

```js
let outputValue = setter.exec('<script src="http://malware-..." />', [
    'htmlEncode',
    'toUpper',
    // ... use listAll to know in-built methods
    'myAsyncCustomSetter',
    // ... any in-built or custom validator methods defined for the instance using push or pushAll
])
```

### <a name="push">
**_instance_.push(key, impl, desc)**
</a>

Add a custom utility function to the instance

- *key* - key to identify the utility method
- *impl* - definition of the utility method
- *desc* - description of the utility method

For ValidatorBaseClass instances, the utilty function takes a value as input, validates constraints we define and accordingly returns true or false. For async utilites, the function should return a Promise that resolves to true or false accordingly.

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

For SetterBaseClass and GetterBaseClass instances, the utility function takes a value as input, transforms it as per our definitions and returns the new value. For async utilites, the function should return a Promise that resolves to new value.

```js
let setter = new SetterBaseClass()
setter.push('myAsyncCustomSetter', function (val) {
    return new Promise((resolve, reject) => {  
    // write your transformations here
    // and return the new value
    resolve(val.replace(/[^a-zA-Z]/g, ''))
    })
}, 'remove non word characters from the input')
```

*Note*: _the new method will replace an existing utility method with the same key in the instance_ 

### <a name="pushAll">
**_instance_.pushAll(arr)**
</a>

Multiple utility methods can be pushed into instance simultaneously

- *_arr_* - an array of objects constaining _key_, _impl_ and _desc_ (see *push* method for definitions) for each utility function to be pushed 

```js
validator.pushAll([
    {
        "key": 'myCustomValidator', 
        "impl": function (val) {
            // write your constraints that the val should satisfy
            // if any of your constraints is not met, indicate the validation failed
            // return false
            // else the val is valid
            // return true
            return /\*/.test(val)
        },
        "desc": 'validates that the input contains atleast one *'
    },
    // ...
    // ... more utility functions here ...
    // ...
])
```

*Note*: _the new method will replace an existing utility method with the same key in the instance_

### <a name="listAll">
**_instance_.listAll()**
</a>

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

### <a name="isValidUtilKey">
**_instance_.isValidUtilKey(utilKey)**
</a>

returns true if _instance_ has the _utilKey_, else throws an error

<!-- what key to verify below, is maskCardNumbers defined above ? -->
```js
console.log(getter.isValidUtilKey('maskCardNumbers'))
// true
console.log(getter.isValidUtilKey('anyRandomKey'))
// Error: Unknown utility key provided
```


## Meta

Distributed under the XYZ license. See ``LICENSE`` for more information.

[https://github.com/mohitsorde/Jsosrm](https://github.com/mohitsorde/Jsosrm)

## Contributing