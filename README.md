# Jsosrm
> A simple JavaScript Object Structurer Retriever and Mapper

[![NPM Version][npm-image]][npm-url]

## What it does?

Without loss of generality, let us consider a common web service scenario where form data entered by a user needs validation and transformation as it goes from View to Model via Controller (potentially on client app and most certainly again on web server before being passed to database) and vice-versa.

```js
let input = {
  'emailId': 'example1@domain.com',
  'firstName': 'exAmple. oNe',
  'lastName': '<script src="https://malicious.worm..."></script>',
  'hobbies': ['tennis', 'cricket'],
  'shippingAddress': [
    {
      'lineOne': '#41, teSt SiTe',
      'city': 'Test. 1 ',
      'state': 'N.A.',
      'country': 'NA',
      'zipCode': '000XXX'
    }
  ],
  'paymentDetails': [{
    'cardNumber': '2222222222222222'
  }],
  'password': 'myPassword*1'
}
```

We definitely require validations for each element like email format or prevention of potential Cross Site Scripting values or so on. We may also require transformations like encrypting the password element or making names as upper case or using different key and so on. Similarly when we retrieve data from database, we may require to perform certain transformations like masking certain digits of card or so on. 

How about if we could define all these requirements verbally like below:

<a name="example">
</a>
```js
const UserSchema = {
  'emailId': {
    'validators': ['maxChar_256', 'emailId'],
    'setters': ['htmlEncode', 'toLower']
  },
  'firstName': {
    'validators': ['maxChar_64', 'nameOnly'],
    'setters': ['htmlEncode', 'nameFormat']
  },
  'lastName': {
    'validators': ['maxChar_64', 'nameOnly'],
    'setters': ['htmlEncode', 'nameFormat'],
    'optional': true
  },
  'hobbies': [{
    'validators': ['alphabetical'],
    'setters': ['toUpper'],
    'getters': ['asLower']
  }],
  'shippingAddress': {
    'parser': [UserAddressParser]
  },
  'paymentDetails': {
    'parser': [PaymentDetailsParser]
  }
}
```

and use it as:

```js
let parsedUser = (new UserParser(input)).getParams()
```

Now _parsedUser_ would contain error if any validations failed or be new transformed object when all our simplistic verbal requirements are met. This is what Jsosrm is built for. (_how **UserParser** is linked to **UserSchema** is documented [here](#structurer-retriever-and-mapper)_)

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
import {ValidatorBaseClass, SetterBaseClass, GetterBaseClass, ParserBaseClass} from 'jsosrm'
```

Now the usage can be classified into two broad sections - one when we are dealing with simple atomic JS types like string or number and other when we are dealing with complex JS data structure like object. We dive directly to second type, with documentation for first type described [here](#utilities).

### Structurer Retriever and Mapper

A JS object can be simple key-value pairs or deeply nested with Array and objects. Jsosrm provides **ParserBaseClass** with methods that follow depth-first approach to enforce structure and validations defined by schema. ParserBaseClass by default is not associated with any schema. The class is provided with default ValidatorBaseClass, SetterBaseClass and GetterBaseClass instances (see [this](#utilities) for details). To link ParserBaseClass with a schema and custom validators, getters, setters if needed, we first define the following folder structure:

```.
  |__ validators
  |  |__ myValidator.js // a file per custom ValidatorBaseClass instance
  |__ setters
  |  |__ mySetter.js // a file per custom SetterBaseClass instance
  |__ getters
  |  |__ myGetter.js // a file per custom GetterBaseClass instance
  |__ schemas
  |  |__ mySchema.js // a file per schema
  |__ models
  |  |__ myModel.js // a file per ParserBaseClass child
```

Instances of ValidatorBaseClass, SetterBaseClass and GetterBaseClass with custom sync/async utility functions can be defined in validators, setters and getters folders respectively. For the example mentioned [here](#example), we need a custom getter that will mask the first 12 of a 16 digit payment card. We do so by creating a file named 'paymentDetailsGetter.js' in 'getters' folder

```js
// .*/getters/paymentDetailsGetter.js
import {GetterBaseClass} from 'jsosrm'
const paymentDetailsGetter = new GetterBaseClass()
paymentDetailsGetter.push('maskCardNumbers', function (val) {
  return val.replace(/([0-9]{12})([0-9]+)/, '************$2')
}, 'masks all digits except the last 4')
module.exports = paymentDetailsGetter
```

Similarly we can define an asynchronous encryption setter for password element if needed by creating instance of ValidatorBaseClass in 'validators' folder.

### <a name="parser-child">
**ParserBaseClass child**
</a>

Let us say our schema 'UserSchema' is created in 'schemas' folder (we will see how to create schema later [here](#schema)). We now create a model 'UserModel' for our schema 'UserSchema' by extending ParserBaseClass and overriding the following attributes:

```js
import {ParserBaseClass} from 'jsosrm'

import {UserSchema} from '../schemas/UserSchema'
// import {userValidator} from '../validators/userValidator'
// import {userSetter} from '../setters/userSetter'
// import {userGetter} from '../getters/userGetter'

function UserModel (params, update, asyncHandle) { // constructor parameters are explained below
  ParserBaseClass.apply(this, arguments)
}

UserModel.prototype = Object.create(ParserBaseClass.prototype) // extend the prototype chain
UserModel.prototype.constructor = UserModel
UserParser.prototype.attrDefs = UserSchema
// for default and custom validators, setters and getters
// UserParser.prototype.validator = userValidator
// UserParser.prototype.setter = userSetter
// UserParser.prototype.getter = userGetter

module.exports = UserModel
```

As explained above, a child overrides the following attributes of ParserBaseClass
 - Required
    - attrDefs: to link schema with child
 - Optional
    - validator: to provide custom validators via instance of ValidatorBaseClass
    - setter: to provide custom setters via instance of SetterBaseClass
    - getter: to provide custom getters via instance of GetterBaseClass

Now lets have a look at how to define schema.

### <a name="schema">
**Schema**
</a>


### Utilities

Instances of ValidatorBaseClass, SetterBaseClass, and GetterBaseClass provide in-built utilities. Also, custom utilities for each instance can be defined. The constructor does not take any arguments.

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
let isValid = validator.exec('t3432df', [
    'isString',
    'alphabetical',
    // ... use listAll to know in-built methods
    'myCustomValidator',
    // ... any in-built or custom validator methods defined for the instance using push or pushAll
]) 
// returns false in this case as test for `alhpabetical` fails
```

In case of SetterBaseClass and GetterBaseClass, the value is transformed as per each utility method. Output of first utility is input to second utility and so on the chain continues till final value is returned

```js
let outputValue = setter.exec('<script src="http://malware-..." />', [
    'htmlEncode',
    'toUpper',
    // ... use listAll to know in-built methods
    'myCustomSetter',
    // ... any in-built or custom validator methods defined for the instance using push or pushAll
])
// escapes html characters like <, >, & ...etc, converts all to Capital case and so on ...
```

### <a name="asyncExec">
**_instance_.asyncExec(value, arrayOfUtilKeys)**
</a>

chain multiple instance utility methods like [exec](#exec), including any asynchronous methods on an input value and return a promise

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

For ValidatorBaseClass instances, the utilty function takes a value as input. We should validate constraints we need inside the function and accordingly return true or false. For async utilites, the function should return a Promise that resolves to true or false accordingly.

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

For SetterBaseClass and GetterBaseClass instances, the utility function takes a value as input, we should transform it as per our need and return the new value. For async utilites, the function should return a Promise that resolves to new value.

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