var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

var schema = {
  AttributeDefinitions: [
    {
      AttributeName: "uri",
      AttributeType: "S"
    },
    {
      AttributeName: "date",
      AttributeType: "S"
    },
  ],
  KeySchema: [
    {
      AttributeName: "uri",
      KeyType: "HASH"
    },
    {
      AttributeName: "date",
      KeyType: "RANGE"
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  TableName: "Comments"
};

exports.handle = function(e, ctx, cb) {
  dynamodb.createTable(schema, function(err, data) {
    if (err) {
      return ctx.fail('create table err: ' + err);
    }
    cb(err, data);
  })
}
