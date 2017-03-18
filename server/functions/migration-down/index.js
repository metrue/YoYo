var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

const TABLE_NAME = 'Comments';

exports.handle = function(e, ctx, cb) {
  dynamodb.deleteTable({ TableName: TABLE_NAME }, function(err, data) {
    if (err) {
      return ctx.fail('delete table err: ' + err);
    }
    cb(err, data);
  })
}
