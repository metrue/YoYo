import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

import api from './api'
import styles from './styles.css'
import { maybeEmailAddress } from './utils'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      text: '',
      email: '',
      list: [],
    }
  }

  componentDidMount() {
    this.fetchCommentList()
  }

  fetchCommentList() {
    api.fetch(window.location.href)
      .then((res) => {
        if (res.status === 200) {
          return res.json()
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

  commentEmailChange(e) {
    const value = e.target.value
    this.setState({
      email: value,
    })
  }

  commentTextChange(e) {
    const value = e.target.value
    this.setState({
      text: value,
    })
  }

  submit() {
    const {
      text,
      email,
    } = this.state

    api.submit({
      user: email,
      date: (new Date()).toISOString(),
      uri: window.location.href,
      text,
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json()
        }
        return new Error(`${res.statusText}`)
      })
      .then(() => {
        setTimeout(() => {
          this.fetchCommentList()
        }, 0)
        this.setState({ text: '' })
      })
      .catch((e) => {
        console.error(`YoYo Got something wrong: ${e}, feedback to h.minghe@gmail.com would be great`)
      })
  }

  publish() {
    const {
      email,
    } = this.state

    if (!maybeEmailAddress(email)) {
      alert(`${email} is not a valid email`)
    } else {
      this.submit()
    }
  }

  render() {
    const {
      list,
      text,
    } = this.state
    return (
      <div className={ styles.YoYoContainer }>
        <div className={ styles.YoYoBoxContainer }>
          <div className={ styles.YoYoInputArea }>
            <textarea
              className={ styles.YoYoComentTextArea }
              value={ text }
              onChange={ ::this.commentTextChange }
            />
          </div>
          <div className={ styles.YoYoUserAction }>
            <input
              className={ styles.YoYoEmailInput }
              type="text"
              placeholder="leave email to get updates"
              onChange={ ::this.commentEmailChange }
            />
            <button
              className={ styles.YoYoCommentPublishButton }
              onClick={ ::this.publish }
            >
              Publish
            </button>
          </div>
        </div>
        <div className={ styles.YoYoComentListContainer }>
          {
            list.map(c => (
              <div className={ styles.YoYoComentItemContainer }>
                <div className={ styles.YoYoComentItemUserAndDate }>
                  <div className={ styles.YoYoComentItemUser }>
                    { c.user }
                    <span className={ styles.YoYoComentItemDate }> - { moment(c.date).format('YYYY-MM-DD HH:MM') } </span>
                  </div>
                </div>
                <div className={ styles.YoYoComentItemText }>
                  <p>
                    { c.text }
                  </p>
                </div>
                <div>
                  <div className={ styles.YoYoCommentItemBottomBorder } />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

const COMMENTOR_ID = 'YoYo'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
