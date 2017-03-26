const AWS = require('aws-sdk')
const uuid = require('uuid/v1')

const dynamodb = new AWS.DynamoDB()
const TableName = process.env.TABLE_NAME

function buildPayload(opt) {
  return {
    Item: {
      id:{
        S: uuid(),
      },
      content: {
        S: opt.content,
      },
      date: {
        S: opt.date,
      },
      user: {
        S: opt.user,
      },
      uri: {
        S: opt.uri,
      },
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName,
  }
}

exports.create = (event, ctx, cb) => {
  cb(null, event)
  const payload = buildPayload(event.body)
  dynamodb.putItem(payload, (err, data) => {
    if (err) {
      return cb(null, 'put item err: '+ err +'\npayload: ' + JSON.stringify(payload))
    }
    cb(err, data)
  })
}

function buildQuery(opt) {
  return {
    ExpressionAttributeValues: {
      ":uri_value": {
        S: opt.uri,
      },
    },
    KeyConditionExpression: "uri = :uri_value",
    TableName,
  }
}

exports.get = (event, ctx, cb) => {
  cb(null, event)
  const cond = buildQuery(event.queryStringParameters)
  dynamodb.query(cond, (err, data) => {
    if (err) {
      return cb(null, 'query error: ' + err +'\ncond: ' + JSON.stringify(cond))
    }
    cb(err, data)
  })
}
