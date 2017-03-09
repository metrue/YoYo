'use strict';

var path = require('path');
var Comment = require(path.resolve(__dirname, './model')).Comment;

exports.handler = function(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  Comment.scan().attributes(['id']).loadAll().exec(callback);
};
