# JSOSRM
> A simple JavaScript Object Structurer Retriever and Mapper

[![NPM Version][npm-image]][npm-url]

## What it does?

When your system acts as a medium of data exchange between an insecure source and a protected target, JSOSRM helps to define schematic structure for the incoming object from the source, ensures the structure passes through a layer of validations and forwards a transformed structured output to the target. Vice-versa, when JSOSRM is provided with the secured data from target, it retrieves the original source structure. That way the source and the target need not be aware of each other.

<!-- image -->

## Where can it be applied?

JSOSRM is modeled to behave like the traditional ORM, except it does not have a concept of queries and is framework agnostic, database agnostic. Hence, it fits as middleware in any system. Examples are present below.

## Installation

```sh
npm install jsosrm --save
```

## Usage and examples

JSOSRM provides four classes that can be imported:

```js
import {ValidatorBaseClass, SetterBaseClass, GetterBaseClass, ParserBaseClass} from 'jsosrm'
```

## Meta

Distributed under the XYZ license. See ``LICENSE`` for more information.

[https://github.com/mohitsorde/jsosrm](https://github.com/mohitsorde/jsosrm)

## Contributing

1. Fork it (<https://github.com/mohitsorde/jsosrm/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
[npm-url]: https://npmjs.org/package/datadog-metrics