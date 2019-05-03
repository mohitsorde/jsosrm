# Jsosrm
> A simple JavaScript Object Structurer Retriever and Mapper

## What it does?

<a name="example">
Without loss of generality, let us consider a common web service scenario where form data entered by a user needs validation and transformation as it goes from View to Model via Controller (potentially on client app and most certainly again on web server before being passed to database) and vice-versa.
</a>

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
<a name="example-schema">
How about if we could define all these requirements verbally like below:
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
    'parser': [AddressModel]
  },
  'paymentDetails': {
    'parser': [PaymentDetailsParser]
  }
}
```

and use it as:

```js
let parsedUser = (new UserModel(input)).getParams()
console.log(parsedUser)
/*
{
  "emailId":"example1@domain.com",
  "firstName":"Example. One",
  "lastName":"&lt;script Src=&quot;https://malicious.Worm...&quot;&gt;&lt;/script&gt;",
  "hobbies":["TENNIS","CRICKET"],
  "shippingAddress":[
    {
      "lineOne":"#41, TEST SITE",
      "city":"TEST. 1 ",
      "state":"N.A.",
      "country":"NA",
      "zipCode":"000XXX"
      }
  ],
  "paymentDetails":[
    {
      "cardNumber":"2222222222222222"
    }
  ]
}
*/
```

and vice-versa retrieve like:

```js
let reverseParsedUser = (new UserModel()).getReverseParams(parsedUser)
console.log(reverseParsedUser)
/*
{
  "emailId":"example1@domain.com",
  "firstName":"Example. One",
  "lastName":"&lt;script Src=&quot;https://malicious.Worm...&quot;&gt;&lt;/script&gt;",
  "hobbies":["tennis","cricket"],
  "shippingAddress":[
    {
      "lineOne":"#41, TEST SITE","
      city":"TEST. 1 ",
      "state":"N.A.",
      "country":"NA",
      "zipCode":"000XXX"
    }
  ],
  "paymentDetails":[
    {"cardNumber":"************2222"}
  ]
}
*/
```

Now 'parsedUser' would contain error if any validations failed or be new transformed object when all our simplistic verbal requirements are met. This is what Jsosrm is built for. (_how **UserParser** is linked to **UserSchema** is documented [here](#structurer-retriever-and-mapper)_)

Features:
 - support for deep nesting of objects and arrays
 - chaining of utility functions
 - custom sync/async validators, setters and getters
 - error contains exact path to reach the failed element in nested object
 - provides the validation key that was failed
 - provide different output key for object attributes
 - retrieves the original key during get operation
 - update mode 

When your system acts as a medium of data exchange between an insecure source and a protected target, Jsosrm helps to define schematic structure for the incoming object from the source, ensures the structure passes through a layer of validations and forwards a transformed structured output to the target. Vice-versa, when Jsosrm is provided with the secured data from target, it retrieves the original source structure. That way the source and the target need not be aware of each other.

<!-- image -->

## Where can it be applied?

Jsosrm is modeled to behave like the traditional ORM, except it does not have a concept of queries and is framework agnostic, database agnostic. Hence, it fits as middleware in any system from UI library/framework like ReactJs in update mode (see [here](#model)) to modern databases like blockchain.

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

A JS object can be simple key-value pairs or deeply nested with Array and more objects. Jsosrm provides **ParserBaseClass** with methods that follow depth-first approach to enforce structure and validations defined by schema. ParserBaseClass by default is not associated with any schema. The class is provided with default ValidatorBaseClass, SetterBaseClass and GetterBaseClass instances (see [this](#utilities) for details). To link ParserBaseClass with a schema and custom validators, getters, setters if needed, we first define the following folder structure:

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

Instances of ValidatorBaseClass, SetterBaseClass and GetterBaseClass with custom sync/async utility functions can be defined in validators, setters and getters folders respectively. For the example mentioned [here](#example), we need a custom getter that will mask the first 12 of a 16 digit payment card (besides the built-in ones - see [this](#listAll)). We do so by creating a file named 'paymentDetailsGetter.js' in 'getters' folder

```js
// .*/getters/paymentDetailsGetter.js
import {GetterBaseClass} from 'jsosrm'
const paymentDetailsGetter = new GetterBaseClass()
paymentDetailsGetter.push(
  'maskCardNumbers', // note the key here which will later be used in schema
  function (val) { // implementation of the utility
    return val.replace(/([0-9]{12})([0-9]+)/, '************$2')
  }, 
  'masks all digits except the last 4' // overview of the function
)
module.exports = paymentDetailsGetter
```

Similarly we can define an asynchronous encryption **setter** for password element and so on wherever applicable.

### <a name="parser-child">
**ParserBaseClass child**
</a>

Let us say our schema 'UserSchema' is created in 'schemas/userSchema.js' file (we will see how to create schema later [here](#schema)). We now create a model 'UserModel' for our schema 'UserSchema' by extending ParserBaseClass and overriding the following attributes:

 - **Required**
    - attrDefs - to link schema with ParserBaseClass child
 - **Optional** (to provide utilities on top of default ones)
    - validator - to provide custom validators via instance of ValidatorBaseClass
    - setter - to provide custom setters via instance of SetterBaseClass
    - getter - to provide custom getters via instance of GetterBaseClass

```js
// models/userParserClass.js
import {ParserBaseClass} from 'jsosrm'

import {UserSchema} from '../schemas/userSchema'
// import {userValidator} from '../validators/userValidator'
// import {userSetter} from '../setters/userSetter'
// import {userGetter} from '../getters/userGetter'

function UserModel (params, update, asyncHandle) { // constructor parameters are explained below
  ParserBaseClass.apply(this, arguments)
}

UserModel.prototype = Object.create(ParserBaseClass.prototype) // extend the class
UserModel.prototype.constructor = UserModel
UserParser.prototype.attrDefs = UserSchema // link the schema
// for default and custom validators, setters and getters
// UserParser.prototype.validator = userValidator
// UserParser.prototype.setter = userSetter
// UserParser.prototype.getter = userGetter

module.exports = UserModel
```

Now lets have a look at how to define schema.

### <a name="schema">
**Schema**
</a>

Schema is a simple JS object with the same keys as input object. In the schema, value of a key is an object with parameters that conforms to a Jsosrm specification. We already caught a glimpse [here](#example-schema) for [this](#example) example. For each key, we can define the following parameters:
 - for any key
    - optional
    - outKey
 - for key with atomic values (like string or number)
    - validators
    - setters
    - getters
 - for key whose value is complex data structure like object or array
    - parser

### <a name="optional">
**optional**
</a>

An input object may contain keys other than the ones defined in the schema. Jsosrm does not validate or set these other keys. But for the defined ones, Jsosrm needs these keys to be strictly present in input. Else it throws the error: 

```js
{
  errCode: 'NULL_INPUT',
  errParam: 'x.x.x.x'
}
```

where **errParam** is the full path to the expected key in input. But there might be a case where a key needs to be optional, yet must strictly pass all the validations and go through transformations when present in input. For such keys, specify _optional_ as true in the schema.

```js
// schemas/UserSchema.js
export const UserSchema = {
  /**
   * definitions for other keys
   **/
  'lastName': {
    'validators': ['maxChar_64', 'nameOnly'],
    'setters': ['htmlEncode', 'nameFormat'],
    'optional': true
  },
  /**
   * definitions for other keys
   **/
}
```

### <a name="out-key">
**outKey**
</a>

Besides transforming values, often the need arises to transform an input key to another name. For such cases, specify the new identification for input key as _outKey_ in the schema.

```js
// schemas/UserSchema.js
export const UserSchema = {
  /**
   * definitions for other keys
   **/
  'emailId': {
    'validators': ['maxChar_256', 'emailId'],
    'setters': ['htmlEncode', 'toLower'],
    'outKey': '_id' // 'emailId' key will be replaced by '_id' while setters are executed
  },
  /**
   * definitions for other keys
   **/
}
```

Note that when we retrieve the parsed object which now has the outKey specified via _getReverseParams_, we get the original input key. This is automatically handled by Jsosrm.

### <a name="val-set-get">
**validators, setters, getters**
</a>

validators, setters and getters are array of keys of default and custom utils that have been provided to child of 'ParserBaseClass' via instances of ValidatorBaseClass, SetterBaseClass and GetterBaseClass respectively (see [this](#parser-child) for details). Value of input key must pass all the validations specified in the validators array and are transformed by each setter utility function specified in setters array. Vice-versa, when retrieving the object via _getReverseParams_, the returned value is transformed by each getter utility function specified in getters array.

We may choose to specify any or all of them for a key as per our need.

```js
// schemas/UserSchema.js
export const UserSchema = {
  /**
   * definitions for other keys
   **/
  'firstName': {
    'validators': ['maxChar_64', 'nameOnly'],
    'setters': ['htmlEncode', 'nameFormat']
  },
  /**
   * definitions for other keys
   **/
}
```

### <a name="parser-in-schema">
**parser**
</a>

We know how to define schema for keys with single atomic values. A more complex structure over this is when a key has atomic values, but an array or deep array of those like below.

```js
let input = 
  /**
   * other keys
   **/
  'hobbies': ['tennis', 'cricket'],
  'exampleArrayKey': [[[['s', 'ome']]['simple', 'atomic'], ['values']]]
  /**
   * other keys
   **/
}
```

For such cases, the schema structure is simply wrapped in an array as below, including the parameters _optional_ and _outKey_:

```js
// schemas/UserSchema.js
export const UserSchema = {
  /**
   * definitions for other keys
   **/
  'hobbies': [{
    'validators': ['alphabetical'],
    'setters': ['toUpper'],
    'getters': ['asLower'],
 // 'optional': true,
 // 'outKey': 'myOutKey' 
  }],
  'exampleArrayKey': [{
    'validators': ['alphabetical'],
    'setters': ['toUpper'],
    'getters': ['asLower'],
 // 'optional': true,
 // 'outKey': 'myOutKey' 
  }],
  /**
   * definitions for other keys
   **/
}
```

No matter how deep a value is inside the array, Jsosrm is smart to mine them and convey in-depth path in case validation fails for one.

A more complex strucutre is when the value of key is a JS object or an array of objects.

```js
let input = {
  /**
   * other keys
   **/
  'shippingAddress': [
    {
      'lineOne': '#41, teSt SiTe',
      'city': 'Test. 1 ',
      'state': 'N.A.',
      'country': 'NA',
      'zipCode': '000XXX'
    },
    /**
   * other address
   **/
  ],
  /**
   * other keys
   **/
}
```

In the schema, such a key must point to another child of ParserBaseClass. The child must have a schema representing the structure of values for the key. 

For the above example, we create a _addressSchema.js_ file in 'schemas' folder.

```js
// schemas/addressSchema.js
export const AddressSchema = {
  'lineOne': {
    'validators': [ 'maxChar_512', 'addressOnly'],
    'setters': [ 'htmlEncode', 'toUpper']
  },
  'city': {
    'validators': ['maxChar_64', 'addressOnly'],
    'setters': ['htmlEncode', 'toUpper']
  },
  'state': {
    'validators': ['maxChar_64', 'addressOnly'],
    'setters': ['htmlEncode', 'toUpper']
  },
  'country': {
    'validators': ['maxChar_2', 'minChar_2', 'alphabetical'],
    'setters': ['toUpper']
  },
  'zipCode': {
    'validators': ['maxChar_16', 'alphaNumeric'],
    'setters': ['toUpper']
  }
}
```

Likewise we create a ParserBaseClass child in 'models/addressParserClass.js' file and link the schema for address:

```js
// models/addressParserClass.js
import {ParserBaseClass} from 'jsosrm'

import {AddressSchema} from '../schemas/addressSchema'

function AddressModel (params) {
  ParserBaseClass.apply(this, arguments)
}

AddressModel.prototype = Object.create(ParserBaseClass.prototype) // extend the class
AddressModel.prototype.constructor = AddressModel
AddressModel.prototype.attrDefs = userAddressSchema //link the schema

module.exports = AddressModel
```

We don't require any custom utility and hence we did not override the default validator, setter or getter instance from ParserBaseClass. Now back to our 'UserSchema', we link the AddressModel to the schema key 'shippingAddress':

```js
// schemas/UserSchema.js
import {AddressModel} from '../models/addressParserClass'

export const UserSchema = {
  /**
   * definitions for other keys
   **/
  'shippingAddress': {
    'parser': [AddressModel]
  },
  /**
   * definitions for other keys
   **/
}
```

Like in the case of array with atomic values, Jsosrm is smart to mine JS object at any depth in an array and similarly return the full path of key whose value failed any validation.

If the value was not an array and a single JS object, we would specify it as below:

```js
'shippingAddress': {
    'parser': AddressModel
  },
```

Note how circular dependency is prevented because of the organization:

<!-- insert the cirxular image here -->

Now that we know how to create children of ParserBaseClass, let's see how to use the model.

### <a name="model">
**ParserBaseClass child Instances**
</a>

We can instantiate ParserBaseClass child with the following parameters:

```js
let instance = new Child(params, update, asyncHandle)
```
  - **Required**
    - params - input object
  - **Optional**
    - update  - false by default
    - asyncHandle  - false by default

Let's take the example 'input' described [here](#example) and the ParserBaseClass child 'UserModel' we created [here](#parser-child).

#### default mode

```js
let userModel = new UserModel(input)
```

In the default mode, 'UserModel' expects all keys defined in its schema to exist in input, unless explicitly stated as optional (see [here](#optional)). None of the validators or getters utility can be async.

#### update mode

```js
let userModel = new UserModel(input, true)
```

In the update mode, 'UserModel' doesn't enforce any of the keys defined in its schema to exist in input. It will behave as if all keys are optional. But if a key is present in input, then it must pass all the validations and will be transformed by each of the setters. None of the validators or getters utility can be async.

#### async mode

```js
let userModel = new UserModel(input, null, true) // update argument can be true or false, won't matter
```

If we have any validators or setters utilty as an async function for any key, then we must specify the 'asyncHandle' argument as true. See the [below section](#push) to know how async getters are specified.

### <a name="model-methods">
**ParserBaseClass methods**
</a>

Any instance of ParserBaseClass child has access to the following methods:
 - [getParams](#get-params)
 - [getReverseParams](#get-reverse-params)

### <a name="get-params">
**childInstance._getParams()_**
</a>

When all of the validations in schema pass and each setters utility has been executed, _getParams_ returns the transformed input. If any validation fails, _getParams_ returns an error object. In async mode, a rejected Promise constaining error object is returned. The error object contains the following details:

 - **errCode** - 
    - equals 'INVALID_INPUT' when a validation fails
    - 'NULL_INPUT' when key is defined in schema but is not present in input
    - 'RUNTIME_ERROR' when there is an uncaught exception in async validators or setters (indicating the custom code was faulty)
 - **errParam** - '.' separated full path of the key for which 'errCode' occured
 - **testKey** - validation id that failed for 'errParam'

For the example [here](#example), let's say that we had three 'shippingAddress' and for the 2nd address, the validation identified by 'maxChar_2' failed for the key 'country'. Then 'getParams' would give the following output:

```js
let userModel = new UserModel(input)
let erredUser = userModel.getParams()
console.log(erredUser) /* prints
{
  "errCode": "INVALID_INPUT",
  "errParam": "shippingAddress.1.country",
  "testKey": "maxChar_2"
} 
*/
```

### <a name="get-reverse-params">
**childInstance._getReverseParams(params, asyncHandle)_**
</a>

 - **Optional**
    - params - object to retrieve
    - asyncHandle - false by default, specify true for async getters

If _getReverseParams_ is called without any arguments on an instance, it executes all the getters specified in its schema on the 'transformed' (_validated and set through setters_) input object provided while constructing the instance and returns the retrieved object. _Getters will be executed in async mode if it was set true while constructing the instance._ _getReverseParams_ reverses the effect of _outKey_ - it would preserve the original key in the retrieved object.

```js
let userModel = new UserModel(input)
let parsedUser = userModel.getParams()
let retrievedUser = userModel.getReverseParams() // applies getters specified in schema on parsedUser
```

Additionaly, you can provide external object to retrieve and set _asyncHandle_ argument to true if getters need to be executed in async mode.

```js
let retrievedUser = userModel.getReverseParams(anotherObject, true)
```

### Utilities

Instances of ValidatorBaseClass, SetterBaseClass, and GetterBaseClass come with built-in utilities. Also, custom utilities for each instance can be defined. The constructor does not take any arguments.

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
**instance._exec(value, arrayOfUtilKeys)_**
</a>

chain multiple instance utility methods on an input value

- *_value_* - input to be processed
- *_arrayOfUtilKeys_* - array of keys of instance utility methods to be executed in order on input value

In case of ValidatorBaseClass instances, returns an object with the following keys:
 -  isValid - equals _true_ if all validations succeed, else is _false_
 -  testKey - equals key of the validation that failed

```js
let test = validator.exec('t3432df', [
    'isString',
    'alphabetical',
    // ... use listAll to know in-built methods
    'myCustomValidator',
    // ... any in-built or custom validator methods defined for the instance using push or pushAll
])
console.log(test)
/*
{
  isValid: false,
  testKey: 'alphabetical'
}
*/
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
**instance._asyncExec(value, arrayOfUtilKeys)_**
</a>

chain multiple instance utility methods like [exec](#exec), including any asynchronous methods on an input value and return a promise

- *_value_* - input to be processed
- *_arrayOfUtilKeys_* - array of keys of instance utility methods to be executed in order on input value

In case of ValidatorBaseClass instances, returns promise resolving to an object with following keys:
 -  isValid - equals _true_ if all validations succeed, else is _false_
 -  testKey - equals key of the validation that failed

```js
let test = validator.exec('testValue', [
    'isString',
    'alphabetical',
    // ... use listAll to know in-built methods
    'myAsyncCustomValidator',
    // ... any custom or async validator methods defined for the instance using push or pushAll
]) 
console.log(test)
/*
{isValid: true}
*/
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
**instance._push(key, impl, desc)_**
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
**instance._pushAll(arr)_**
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
**instance._listAll()_**
</a>

Lists key and description of all in-built and custom _instance_ utility methods that were pushed

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
**instance._isValidUtilKey(utilKey)_**
</a>

returns true if _instance_ has the _utilKey_, else throws an error

<!-- what key to verify below, is maskCardNumbers defined above ? -->
```js
console.log(getter.isValidUtilKey('maskCardNumbers'))
// true
console.log(getter.isValidUtilKey('anyRandomKey'))
// Error: Unknown utility key provided
```


## LICENSE

MIT © [Mohit Sorde](https://www.linkedin.com/in/mohitsorde)