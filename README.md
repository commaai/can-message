# can-message
Pack and unpack CAN bus data.

This library is designed for use with the [Panda OBD-II Dongle](https://shop.comma.ai/products/panda-obd-ii-dongle) as part of [pandajs](https://github.com/commaai/pandajs).

## Installation
`npm i --save can-message`

or

`yarn add can-message`

## Usage
```js
import { canToObject, objectToCan } from 'can-message';

// parse raw buffer into can data
var messageArray = canToObject(buffer);
// messageArray is an array of { address, busTime, data, bus }

// create a buffer containing a can message
var buffer = objectToCan(myCanMessage);
```

```js
const CanMessage = require('can-message');

// parse raw buffer into can data
var messageArray = CanMessage.canToObject(buffer);
// messageArray is an array of { address, busTime, data, bus }

// create a buffer containing a can message
var buffer = CanMessage.objectToCan(myCanMessage);
```

## Contributing
`yarn run test`

# License
MIT @ comma.ai

Read more about how to get started hacking your car with Panda [here](https://medium.com/@comma_ai/a-panda-and-a-cabana-how-to-get-started-car-hacking-with-comma-ai-b5e46fae8646).
