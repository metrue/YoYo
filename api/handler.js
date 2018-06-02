const sgMail = require('@sendgrid/mail')
const AWS = require('aws-sdk')
const Config = require('./config')

AWS.config.update({ region: 'us-east-1' })
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const dynamoDb = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true })
const uuid = require('uuid')

const { YOYO_EMAIL, YOYO_DB_TABLE } = Config

function notify (to, uri) {
  const text = `
Hi Friend,
New reply recieved from ${uri}
`
  const html = `
Hi Friend,
New reply recieved from ${uri}
`
  const payload = {
    to,
    from: YOYO_EMAIL,
    replyTo: YOYO_EMAIL,
    subject: `New reply recieved`,
    text,
    html
  }
  sgMail.send(payload)
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
      updatedAt: updatedAt
    }
  }

  return dynamoDb.put(params, (error, data) => {
    if (!error) {
      for (const parent of (parents || [])) {
        notify(parent, uri)
      }

      const siteOwnerEmail = process.env.SITE_OWNER_EMAIL
      if (siteOwnerEmail) {
        notify(siteOwnerEmail, uri)
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
      response(error, data.Items, cb)
    }
  })
}

module.exports = {
  create,
  get,
  update,
  query,
}
