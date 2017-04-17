import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

import api from './api'
import styles from './styles.css'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
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

  change(e) {
    const value = e.target.value
    this.setState({
      value,
    })
  }

  submit() {
    const { value } = this.state
    api.submit({
      user: 'test-user-1',
      date: (new Date()).toISOString(),
      uri: window.location.href,
      text: value,
    }).then((res) => {
      if (res.status === 200) {
        return res.json()
      }
      console.warn(`${res.status} - ${res.statusText}`)
      return new Error(`${res.statusText}`)
    }).then((data) => {
      setTimeout(() => {
        this.fetchCommentList()
      }, 0)
      this.setState({ value: '' })
    }).catch((e) => {
      console.warn(e)
    })
  }

  follow(e) {
    console.warn(e.target.checked)
  }

  render() {
    const { list, value } = this.state
    return (
      <div className={ styles.YoYoContainer }>
        <div className={ styles.YoYoBoxContainer }>
          <div className={ styles.YoYoInputArea }>
            <textarea
              className={ styles.YoYoComentTextArea }
              value={ value }
              onChange={ ::this.change }
            />
          </div>
          <div className={ styles.YoYoUserAction }>
            <input
              className={ styles.YoYoEmailInput }
              type="text"
              placeholder="leave email to get updates"
            />
            {/* <button */}
            {/*   className={ styles.YoYoWatchButton } */}
            {/*   onClick={ ::this.follow } */}
            {/* > */}
            {/*   Watch */}
            {/* </button> */}
            <button
              className={ styles.YoYoCommentPublishButton }
              onClick={ ::this.submit }
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
                  </div>
                  <div className={ styles.YoYoComentItemDate }>
                    - { moment(c.date).format('YYYY-MM-DD HH:MM') }
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
