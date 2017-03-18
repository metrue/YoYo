var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

var params = {
  ExpressionAttributeValues: {
    ":uri_value": {
      S: "https://minghe.me"
    },
  },
  KeyConditionExpression: "uri = :uri_value",
  // ProjectionExpression: "id",
  TableName: "Comments"
};

exports.handle = function(e, ctx, cb) {
  dynamodb.query(params, function(err, data) {
    if (err) {
      return ctx.fail('query error: ' + err)
    }
    cb(err, data);
  });
}
