import React from 'react'
import ReactDOM from 'react-dom'
import Cookies from 'js-cookie'

import api from './api'
import styles from './styles.css'
import CommentItem from './components/CommentItem'
import LoginBox from './components/LoginBox'

import {
  commentToMention,
  uniqueMentionsByUser,
} from './utils'

const YOYO_ADMIN_TOKEN_NAME = 'YOYO_ADMIN_TOKEN_NAME'

class App extends React.Component {
  state = {
    username: '',
    password: '',
    token: Cookies.get(YOYO_ADMIN_TOKEN_NAME),
    list: [],
  }

  componentDidMount = () => {
    this.fetchCommentList()
  }

  fetchCommentList = () => {
    api.query()
      .then((res) => {
        if (res.status === 200) {
          return res.json()
        }
        return new Error(`${res.statusText}`)
      })
      .then((data) => {
        this.setState({
          list: data,
          suggestions: uniqueMentionsByUser(data.map(commentToMention).filter((c) => c !== null)),
        })
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

  login = () => {
    const { username, password } = this.state
    api.login(username, password)
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json()
        }
        throw new Error('login failed')
      })
      .then((data) => {
        const { token } = data
        Cookies.set(YOYO_ADMIN_TOKEN_NAME, token, { expires: 30 })
        this.setState({ token })
      })
      .catch((e) => {
        console.warn(e)
      })
  }

  render() {
    const {
      token,
      list,
    } = this.state

    if (!token) {
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
