'use strict';

var path = require('path');
var vogels = require('vogels');
var Joi = require('joi');

vogels.AWS.config.loadFromPath(path.resolve(__dirname, './config.json'));
vogels.AWS.config.update({region: 'us-west-2'});

exports.Comment = vogels.define('Comment', {
  hashKey: 'id',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(),
    author: Joi.string().trim(),
    email: Joi.string().email(),
    content: Joi.string().trim()
  },
  tableName: 'comments'
});

exports.vogels = vogels;
