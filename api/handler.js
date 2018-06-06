const sgMail = require('@sendgrid/mail')
const AWS = require('aws-sdk')
const uuid = require('uuid')
const Config = require('./config')

const {
  YOYO_EMAIL,
  YOYO_DB_TABLE,
  SITE_OWNER_EMAIL,
  SENDGRID_API_KEY
} = Config

AWS.config.update({ region: 'us-east-1' })
sgMail.setApiKey(SENDGRID_API_KEY)

const dynamoDb = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true })

function notify (to, options = {}) {
  const { uri, text } = options

  const textContent = `
Hi Friend, \r\n
New reply recieved from ${uri} \r\n
\r\n\r\n
-----\r\n
 ${text}
-----\r\n
\r\n \r\n

- YoYo
`
  const htmlContent = `
Hi Friend, <br>
New reply recieved from ${uri} <br>
<br><br>
-----<br>
 ${text}
-----<br>
<br><br>

- YoYo
`
  const payload = {
    to,
    from: YOYO_EMAIL,
    replyTo: YOYO_EMAIL,
    subject: `YoYo: New reply recieved`,
    textContent,
    htmlContent
  }
  sgMail.send(payload).then((data) => {
    console.log(`SEND OK`)
  }).catch((e) => {
    // TODO handle a exception
    console.error(e)
  })
}

const response = (err, data = {}, cb) => {
  const resp = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  }
  cb(err, resp)
}

const isModerator = (email) => email === SITE_OWNER_EMAIL

const create = function (event, ctx, cb) {
  const data = JSON.parse(event.body)
  const { email, uri, text, parents } = data
  const id = uuid.v1()
  const updatedAt = (new Date()).toISOString()
  const params = {
    TableName: YOYO_DB_TABLE,
    Item: {
      email,
      uri,
      text,
      id,
      mod: isModerator(email),
      updatedAt: updatedAt
    }
  }

  return dynamoDb.put(params, (error, data) => {
    if (!error) {
      for (const parent of (parents || [])) {
        notify(parent, { uri, text })
      }

      if (SITE_OWNER_EMAIL) {
        notify(SITE_OWNER_EMAIL, { uri, text })
      }
    }
    response(error, params.Item, cb)
  })
}

const get = function (event, ctx, cb) {
  const { id } = event.pathParameters
  const params = {
    TableName: YOYO_DB_TABLE,
    Key: {
      id: id
    }
  }

  return dynamoDb.get(params, (error, data) => {
    if (error) {
      cb(error)
    }
    response(error, data.Item, cb)
  })
}

const update = function (event, ctx, cb) {
  const { id } = event.pathParameters
  const body = JSON.parse(event.body)
  const params = {
    TableName: YOYO_DB_TABLE,
    FilterExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': id
    }
  }

  return dynamoDb.scan(params, (error, data) => {
    if (error) {
      cb(error)
    } else if (data.Items.length > 0) {
      const item = data.Items[0]
      const { uri, text, email } = body
      const params = {
        TableName: YOYO_DB_TABLE,
        Key: {
          id: id
        },
        ExpressionAttributeNames: {
          '#email': 'email',
          '#text': 'text',
          '#uri': 'uri',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':email': email || item.email,
          ':uri': uri || item.uri,
          ':text': text || item.text,
          ':updatedAt': (new Date()).toISOString(),
        },
        UpdateExpression: 'SET #email = :email, #updatedAt = :updatedAt, #uri = :uri, #text = :text',
        ReturnValues: 'ALL_NEW'
      }
      return dynamoDb.update(params, (error, data) => {
        if (error) {
          cb(error)
        }
        response(error, data.Attributes, cb)
      })
    } else {
      response(error, { message: 'no such item with ' + id })
    }
  })
}

const query = (event, ctx, cb) => {
  const { uri } = event.queryStringParameters
  const params = {
    TableName: YOYO_DB_TABLE,
    FilterExpression: 'uri = :uri',
    ExpressionAttributeValues: {
      ':uri': uri
    }
  }

  return dynamoDb.scan(params, (error, data) => {
    if (error) {
      cb(error)
    } else {
      const items = data.Items.sort((a, b) => {
        const au = a.updatedAt
        const bu = b.updatedAt
        if (au > bu) {
          return -1
        } else if (au < bu) {
          return 1
        } else {
          return 0
        }
      })
      response(error, items, cb)
    }
  })
}

module.exports = {
  create,
  get,
  update,
  query,
}
