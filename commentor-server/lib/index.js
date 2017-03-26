const AWS = require('aws-sdk')
const uuid = require('uuid/v1')

const dynamodb = new AWS.DynamoDB({region: 'us-east-1'})
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
  const body = event.body ? JSON.parse(event.body) : {}
  const payload = buildPayload(body)
  dynamodb.putItem(payload, (err, data) => {
    if (err) {
      return ctx.fail({
        "statusCode": 500,
        "body": `put item error: ${err}\npayload: ${JSON.stringify(payload, null, 2)}`
      })
    }
    cb(null, {"statusCode": 200, "body": JSON.stringify(data)})
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
  const queryParams = event.queryStringParameters || {}
  const cond = buildQuery(queryParams)
  dynamodb.query(cond, (err, data) => {
    if (err) {
      return ctx.fail({
        "statusCode": 500,
        "body": `query error: ${err}\ncond: ${JSON.stringify(cond, null, 2)}`
      })
    }
    cb(null, {"statusCode": 200, "body": JSON.stringify(data)})
  })
}
