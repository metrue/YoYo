import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

import api from './api'
import styles from './styles.css'

require('bootstrap/dist/css/bootstrap.css')

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

  render() {
    const { list, value } = this.state
    return (
      <div className={ `container ${styles.yoyoContainer}` }>
        <div className={ styles.commentBoxContainer }>
          <textarea
            className="form-control"
            value={ value }
            onChange={ ::this.change }
          />
          <div className={ styles.submitButtonContainer }>
            <button
              className="btn btn-default"
              onClick={ ::this.submit }
            >
              Submit
            </button>
          </div>
        </div>
        <div className={ `list-group ${styles.commentListContainer}` }>
          {
            list.map(c => (
              <div className={ `list-group-item ${styles.commentContainer}` }>
                <div className={ styles.commentDateContainer }>
                  { c.user } - { moment(c.date).format('YYYY-MM-DD HH:MM') }
                </div>
                <div className={ styles.commentTextContainer }>
                  <p className="list-group-item-text">
                    { c.text }
                  </p>
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
