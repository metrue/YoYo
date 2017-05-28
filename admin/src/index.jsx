import React from 'react'
import ReactDOM from 'react-dom'

import api from './api'
import styles from './styles.css'
import CommentItem from './components/CommentItem'
import LoginBox from './components/LoginBox'

class App extends React.Component {
  state = {
    username: '',
    password: '',
    authed: true,
    domain: null,
    list: [],
  }

  componentDidMount = () => {
    this.fetchCommentList()
  }

  fetchCommentList = () => {
    const { domain } = this.state
    api.query(domain)
      .then((res) => {
        if (res.status === 200) {
          return res.json()
        } else if (res.status === 401) {
          this.setState({ authed: false })
        }
        return new Error(`${res.statusText}`)
      })
      .then((data) => {
        this.setState({ list: data })
      })
      .catch((e) => {
        console.warn(e)
      })
  }

  delete = (id) => {
    api.delete(id)
      .then((resp) => {
        if (resp.status === 204) {
          setTimeout(() => {
            this.fetchCommentList()
          }, 0)
        } else if (resp.status === 201) {
          this.setState({ authed: false })
        } else {
          alert(resp.statusText)
        }
      })
  }

  usernameChange = (e) => {
    const username = e.target.value
    this.setState({
      username,
    })
  }

  passwordChange = (e) => {
    const password = e.target.value
    this.setState({
      password,
    })
  }

  domainChange = (e) => {
    const domain = e.target.value
    this.setState({ domain })
  }

  login = () => {
    const { username, password } = this.state
    api.login(username, password)
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json()
        } else if (resp.status === 201) {
          this.setState({ authed: false })
        }
        throw new Error('login failed')
      })
      .then(() => {
        this.fetchCommentList()
      })
      .catch((e) => {
        console.warn(e)
      })
  }

  render() {
    const { list, authed } = this.state

    if (!authed) {
      return (
        <LoginBox
          usernameChange={ this.usernameChange }
          passwordChange={ this.passwordChange }
          login={ this.login }
        />
      )
    }

    return (
      <div className={ styles.YoYoContainer }>
        <div className={ styles.YoYoSiteDomainInputContainer }>
          <input
            placeholder="domain"
            onChange={ this.domainChange }
          ></input>
          <button onClick={ this.fetchCommentList }> Submit </button>
        </div>
        <div className={ styles.YoYoCommentListContainer }>
          {
            list.map(c => <CommentItem comment={ c } onDelete={ this.delete } />)
          }
        </div>
      </div>
    )
  }
}

const COMMENTOR_ID = 'YoYo'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
