import React from 'react'

import styles from './styles.css'
import INTL_TEXT from '../../intl_text'

const SubmitButton = ({ email, onEmailChange, onPublish }) => (
  <div className={ styles.YoYoUserAction }>
    <input
      className={ styles.YoYoEmailInput }
      type="text"
      value={ email }
      placeholder={ INTL_TEXT.emailPlaceholderText }
      onChange={ onEmailChange }
    />
    <button
      className={ styles.YoYoCommentPublishButton }
      onClick={ onPublish }
    >
      { INTL_TEXT.publlishButtonTitleText }
    </button>
  </div>
)

SubmitButton.propTypes = {
  email: React.PropTypes.string,
  onEmailChange: React.PropTypes.func,
  onPublish: React.PropTypes.func,
}

export default SubmitButton
