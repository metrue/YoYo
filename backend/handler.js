const sgMail = require('@sendgrid/mail')
const AWS = require('aws-sdk')

AWS.config.update({ region: 'us-east-1' })
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const dynamoDb = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true })
const uuid = require('uuid')

const TableName = process.env.DYNAMODB_TABLE

function sendWelcomeEmail (to) {
  const payload = {
    to: to.email,
    from: process.env.ASMALLTALK_EMAIL, // TODO our platform email here
    replyTo: process.env.ASMALLTALK_EMAIL,
    subject: `欢迎来到小对话`,
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
  const { user, uri, text, parents } = data
  for (const parent of (parents || [])) {
    //TODO notification to user
  }
  const id = uuid.v1()
  const updatedAt = (new Date()).toISOString()
  const params = {
    TableName: TableName,
    Item: {
      user,
      uri,
      text,
      id,
      updatedAt: updatedAt
    }
  }

  return dynamoDb.put(params, (error, data) => {
    response(error, params.Item, cb)
  })
}

const get = function (event, ctx, cb) {
  const { id } = event.pathParameters
  const params = {
    TableName: TableName,
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

const list = function (event, ctx, cb) {
  const params = {
    TableName: TableName,
    ExpressionAttributeValues: {
      ':updatedAt': (new Date('1988-11-14')).toISOString(),
    },
    FilterExpression: 'updatedAt > :updatedAt'
  }

  return dynamoDb.scan(params, (err, data) => {
    if (err) {
      cb(err)
    } else {
      response(err, data.Items, cb)
    }
  })
}

const update = function (event, ctx, cb) {
  const { id } = event.pathParameters
  const body = JSON.parse(event.body)
  const params = {
    TableName: TableName,
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
      const { uri, text, user } = body
      const params = {
        TableName: TableName,
        Key: {
          id: id
        },
        ExpressionAttributeNames: {
          '#user': 'user',
          '#text': 'text',
          '#uri': 'uri',
          '#updatedAt': 'updatedAt',
        },
        ExpressionAttributeValues: {
          ':user': user || item.user,
          ':uri': uri || item.uri,
          ':text': text || item.text,
          ':updatedAt': (new Date()).toISOString(),
        },
        UpdateExpression: 'SET #user = :user, #updatedAt = :updatedAt, #uri = :uri, #text = :text',
        ReturnValues: 'ALL_NEW'
      }
      console.log(params)
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

module.exports = {
  create: create,
  get: get,
  update: update,
  list: list
}
