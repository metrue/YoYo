'use strict';

var path = require('path');
var Comment = require(path.resolve(__dirname, './model')).Comment;

exports.handler = function(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));

  var id = event.id;
  Comment.get(id, function (err, comment) {
    if (err)  {
      return context.fail(err);
    }
    callback(null, comment.get());
  });
};
