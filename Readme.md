
# sns.js

  Simple publish and parse module for SNS

## Getting Started

Install this module:

```js
npm install sns.js
```

Make sure these variables are in your `process.env`:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
```

Use in your code:

```js
const SNS = require('sns.js')

// publish onto SNS, returns a promise
await SNS.publish(topicArn, message)

// derive the message from an SNS event
let message = SNS.parse(event)
```

## License

MIT
