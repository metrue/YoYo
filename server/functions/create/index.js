var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var uuid = require('uuid/v1')


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
    TableName: "Comments"
  };
}

exports.handle = function(e, ctx, cb) {
  var payload = buildPayload(e)
  dynamodb.putItem(payload, function(err, data) {
    if (err) {
      return ctx.fail('put item err: '+ err);
    }
    cb(err, data);
  });
}
