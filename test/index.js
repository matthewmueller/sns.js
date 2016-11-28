/**
 * Modules
 */

const assert = require('assert')
const SNS = require('..')

/**
 * Tests
 */

describe('index', () => {

  // tests
  it('should parse correctly', async () => {
    let example = {
      'Records': [
        {
          'EventSource': 'aws:sns',
          'EventVersion': '1.0',
          'EventSubscriptionArn': 'arn:aws:sns:us-west-2:xxx:article-import-dev:yyy',
          'Sns': {
            'Type': 'Notification',
            'MessageId': 'zzz',
            'TopicArn': 'arn:aws:sns:us-west-2:xxx:article-import-dev',
            'Subject': null,
            'Message': '{"hello":"world"}',
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

    let message = SNS.parse(example)
    assert.deepEqual(message, {
      hello: 'world'
    })
  })

  it('should publish', async () => {
    // need to test this on AWS's side
    await SNS.publish(process.env.AWS_SNS_TOPIC_ARN, {
      hello: 'world!'
    })
  })

  it('should support wrapping payloads for testing', () => {
    const payload = { hello: 'world' }
    assert.deepEqual(SNS.parse(SNS.wrap(payload)), payload)
  })
})

