import setup from './setup'
import { hashHistory, Router, Route } from 'react-router'
import Cookie from 'js-cookie'

import styles from './styles.css'

function getLocalToken() {

}

function setLocalToen() {
  Cookie.set('commentor', '00|11|33')
}


class API {
  constructor(server) {
    this.server = server
  }

  verifyToken(token) {
  }

  authUser(email, password) {

  }
}


class CommentBox extends React.Component {
  constructor() {
    super()

    this.state = {
      username: null,
      email: null,
      content: null,
    }
  }

  isValidUser() {

  }

  login() {
    const { username, email } = this.state
  }

  usernameChange(e) {
    const value = e.target.value
    this.setState({
      username: value,
    })
  }

  emailChange(e) {
    const value = e.target.value
    this.setState({
      email: value,
    })
  }

  contentChange(e) {
    const value = e.target.value
    this.setState({
      content: value,
    })
  }

  submit() {
    const { username, email, content } = this.state
    console.warn(username, email, content)
  }

  render() {
    return (
      <div className={ styles.cContainer }>
        <div className={ styles.cBox }>
          <textarea onChange={ ::this.contentChange } />
        </div>
        <div className={ styles.cAuthor }>
          <div className={ styles.cAuthorInfo }>
            <input
              placeholder="username"
              onChange={ ::this.usernameChange }
            ></input>
            <input
              placeholder="email"
              onChange={ ::this.emailChange }
            ></input>
          </div>
          <div className={ styles.cSubmitButton }>
            <button
              type="submit"
              onClick={ ::this.submit }
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  }
}

function App() {
  return (
    <div className="container">
      <Router history={ hashHistory }>
        <Route path="/" component={ CommentBox } />
      </Router>
    </div>
  )
}

const { render } = setup(App, [])
render(document.querySelector('#main'))
