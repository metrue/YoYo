import React from 'react'
import moment from 'moment'

import styles from './styles.css'

const CommentItem = ({ comment }) => (
  <div className={ styles.YoYoCommentItemContainer }>
    <div className={ styles.YoYoCommentItemUserAndDate }>
      <div className={ styles.YoYoCommentItemUser }>
        { comment.user.replace(/@.*$/, '') }
        <span className={ styles.YoYoCommentItemDate }> - { moment(comment.date).format('YYYY-MM-DD HH:MM') } </span>
      </div>
    </div>
    <div className={ styles.YoYoCommentItemText }>
      <p>
        { comment.text }
      </p>
    </div>
  </div>
)

CommentItem.propTypes = {
  comment: React.PropTypes.object,
}

export default CommentItem
