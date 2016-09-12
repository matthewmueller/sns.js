/**
 * Module dependencies
 */

const parse = require('lambda-sns-event-message')
const assert = require('assert')
const AWS = require('aws-sdk')

/**
 * Configuration
 */

const config = new AWS.Config({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION
})

/**
 * Parse an incoming message (ex. Lambda)
 *
 * @param {Object} message
 * @return {Mixed}
 */

exports.parse = function (message) {
  return parse(message)
}

/**
 * Publish a message
 *
 * @param {String} topicArn
 * @param {Message} message
 */

exports.publish = function (topicArn, message) {
  assert(topicArn, 'publish requires an SNS topic ARN')

  let sns = new AWS.SNS(config)
  let p = new Deferred()
  let params = {}

  if (typeof topicArn === 'string') {
    params = { TopicArn: topicArn }
    params.Message = JSON.stringify(message || {})
  } else {
    params = assign({}, topicArn)
  }

  sns.publish(params, function (err, data) {
    return err ? p.reject(err) : p.resolve(data)
  })

  return p
}

/**
 * Create a Deferred object
 *
 * @return {Deferred}
 */

function Deferred () {
  const p = new Promise(function (resolve, reject) {
    this.resolve = resolve
    this.reject = reject
  }.bind(this))

  this.then = p.then.bind(p)
  this.catch = p.catch.bind(p)
}
