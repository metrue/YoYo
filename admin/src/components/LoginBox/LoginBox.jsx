import React from 'react'

import styles from './styles.css'

const LoginBox = ({ usernameChange, passwordChange, login }) => (
  <div className={ styles.container }>
    <div className={ styles.boxContainer }>
      <div className={ styles.inputContainer }>
        <input
          placeholder="Username"
          onChange={ usernameChange }
        />
      </div>
      <div className={ styles.inputContainer }>
        <input
          placeholder="Password"
          onChange={ passwordChange }
        />
      </div>
      <div className={ styles.buttonContainer }>
        <button onClick={ login }> Login </button>
      </div>
    </div>
  </div>
)

LoginBox.propTypes = {
  usernameChange: React.PropTypes.func,
  passwordChange: React.PropTypes.func,
  login: React.PropTypes.func,
}

export default LoginBox
