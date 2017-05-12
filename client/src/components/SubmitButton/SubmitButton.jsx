import React from 'react'
import styles from './styles.css'

const SubmitButton = ({ email, onEmailChange, onPublish }) => (
  <div className={ styles.YoYoUserAction }>
    <input
      className={ styles.YoYoEmailInput }
      type="text"
      value={ email }
      placeholder="leave email to get updates"
      onChange={ onEmailChange }
    />
    <button
      className={ styles.YoYoCommentPublishButton }
      onClick={ onPublish }
    >
      Publish
    </button>
  </div>
)

SubmitButton.propTypes = {
  email: React.PropTypes.string,
  onEmailChange: React.PropTypes.func,
  onPublish: React.PropTypes.func,
}

export default SubmitButton
