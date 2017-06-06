const Comments = require('./comments')

function Dal(config) {
  this.comments = new Comments({ ...config, collectionName: 'Comments' })
}

module.exports = Dal
