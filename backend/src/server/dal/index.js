import Comments from './comments'

export default function Dal(config) {
  this.comments = new Comments({ ...config, collectionName: 'Comments' })
}
