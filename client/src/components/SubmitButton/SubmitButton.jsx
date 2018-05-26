import React from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'
import INTL_TEXT from '../../intl_text'

const SubmitButton = ({ email, onEmailChange, onPublish }) => (
  <div className={styles.YoYoUserAction}>
    <input
      className={styles.YoYoEmailInput}
      type='text'
      value={email}
      placeholder={INTL_TEXT.emailPlaceholderText}
      onChange={onEmailChange}
    />
    <button
      className={styles.YoYoCommentPublishButton}
      onClick={onPublish}
    >
      { INTL_TEXT.publlishButtonTitleText }
    </button>
  </div>
)

SubmitButton.propTypes = {
  email: PropTypes.string,
  onEmailChange: PropTypes.func,
  onPublish: PropTypes.func
}

export default SubmitButton
