import Comments from './comments'

export default class Dal {
  constructor(config) {
    this.comments = new Comments(config)
  }
}
