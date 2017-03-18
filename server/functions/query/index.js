var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

function buildQuery(opt) {
  return {
    ExpressionAttributeValues: {
      ":uri_value": {
        S: opt.uri,
      },
    },
    KeyConditionExpression: "uri = :uri_value",
    // ProjectionExpression: "id",
    TableName: "Comments"
  };
}

exports.handle = function(e, ctx, cb) {
  dynamodb.query(buildQuery(e), function(err, data) {
    if (err) {
      return ctx.fail('query error: ' + err)
    }
    cb(err, data);
  });
}
