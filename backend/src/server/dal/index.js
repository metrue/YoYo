import BaseDal from './base_dal'

export default function Dal(config) {
  this.comments = new BaseDal({ ...config, collectionName: 'Comments' })
}
