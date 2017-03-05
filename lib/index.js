'use strict';

var path = require('path');
var Comment = require(path.resolve(__dirname, './model')).Comment;

module.exports = function(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));

  var values = {
    author: event.author,
    email: event.email,
    content: event.content
  };

  Comment.create(values, function (err, comment) {
    if (err)  {
      return context.fail(err);
    }
    callback(null, comment.get());
  });
};
