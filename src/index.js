'use strict'

/**
 * Module dependencies
 */

const parse = require('lambda-sns-event-message')
const SNS = require('aws-sdk/clients/sns')
const assign = require('object-assign')
const Deferred = require('deferral')
const assert = require('assert')

/**
 * Configuration
 */

const config = {
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION
}

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

  let sns = new SNS(config)
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
 * Wrap a payload in a SNS record
 *
 * @param {Object} payload
 * @return {Object} message
 */

exports.wrap = function (payload) {
  return {
    'Records': [
      {
        'EventSource': 'aws:sns',
        'EventVersion': '1.0',
        'EventSubscriptionArn': 'arn:aws:sns:us-west-2:123456789012:article-import-dev:yyy',
        'Sns': {
          'Type': 'Notification',
          'MessageId': 'zzz',
          'TopicArn': 'arn:aws:sns:us-west-2:123456789012:article-import-dev',
          'Subject': null,
          'Message': JSON.stringify(payload),
          'Timestamp': '2016-09-12T06:40:55.990Z',
          'SignatureVersion': '1',
          'Signature': 'sig',
          'SigningCertUrl': 'cert',
          'UnsubscribeUrl': 'unsub',
          'MessageAttributes': {
            'AWS.SNS.MOBILE.MPNS.Type': {
              'Type': 'String',
              'Value': 'token'
            },
            'AWS.SNS.MOBILE.MPNS.NotificationClass': {
              'Type': 'String',
              'Value': 'realtime'
            },
            'AWS.SNS.MOBILE.WNS.Type': {
              'Type': 'String',
              'Value': 'wns/badge'
            }
          }
        }
      }
    ]
  }
}
