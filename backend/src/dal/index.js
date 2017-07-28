const Comments = require('./comments')

function Dal(config) {
  this.comments = new Comments( Object.assign(config, { collectionName: 'Comments' }))
}

module.exports = Dal
