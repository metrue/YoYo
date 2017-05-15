import React from 'react'
import moment from 'moment'

import styles from './styles.css'

const CommentItem = ({ comment, onDelete }) => (
  <div className={ styles.YoYoCommentItemContainer }>
    <div className={ styles.YoYoCommentItemUserAndDate }>
      <div className={ styles.YoYoCommentItemUser }>
        { comment.user }
        <span className={ styles.YoYoCommentItemDate }> - { moment(comment.date).format('YYYY-MM-DD HH:MM') } </span>
      </div>
    </div>
    <div className={ styles.YoYoCommentItemText }>
      <p>
        { comment.text }
      </p>
    </div>
    <div className={ styles.YoYoCommentItemDeleteButtonContainer }>
      <button
        className={ styles.YoYoCommentItemDeleteButton }
        onClick={ () => onDelete(comment._id) }
      >
        delete
      </button>
    </div>
  </div>
)

CommentItem.propTypes = {
  comment: React.PropTypes.object,
  onDelete: React.PropTypes.func,
}

export default CommentItem
