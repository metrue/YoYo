import React from 'react'
import PropTypes from 'prop-types'
import MarkdownRenderer from 'react-markdown-renderer'

import styles from './styles.css'

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()

  const leftPadZero = (val) => {
    if (val < 10) {
      return `0${val}`
    }
    return `${val}`
  }

  const month = leftPadZero(date.getMonth() + 1)
  const day = leftPadZero(date.getDate())
  const hours = leftPadZero(date.getHours())
  const minutes = leftPadZero(date.getMinutes())

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const CommentItem = ({ comment }) => (
  <div className={ styles.YoYoCommentItemContainer }>
    <div className={ styles.YoYoCommentItemUserAndDate }>
      <div className={ styles.YoYoCommentItemUser }>
        <p>
          { comment.email.split('@')[0] }
          { comment.mod ? <span className={ styles.YoYoCommentItemMod }> MOD </span> : null }
          <span className={styles.YoYoCommentItemDate}> - { formatDate(comment.updatedAt) } </span>
        </p>
      </div>
    </div>
    <div className={styles.YoYoCommentItemText}>
      <MarkdownRenderer markdown={comment.text} />
    </div>
  </div>
)

CommentItem.propTypes = {
  comment: PropTypes.object
}

export default CommentItem
