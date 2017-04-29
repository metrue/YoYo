import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

import api from './api'
import styles from './styles.css'
import { maybeEmailAddress, validateComment } from './utils'

const {
  array,
  string,
  func,
} = React.PropTypes

const OpenIcon = ({ onClick }) => (
  <div onClick={ onClick } className={ styles.YoYoOpenIcon }>
    <svg width="28" height="24" className="result-item-expando">
      <g transform="translate(14 12)">
        <g className="expando-glyph">
          <polygon points="-1.7,-5 3.3,0 -1.7,5 -2.9,3.8 1,0 -2.9,-3.8"></polygon>
        </g>
      </g>
    </svg>
    <span className={ styles.YoYoLabelTitle }> 想说点什么? </span>
  </div>
)

OpenIcon.propTypes = {
  onClick: func,
}

const CloseIcon = ({ onClick }) => (
  <div onClick={ onClick } className={ styles.YoYoCloseIcon }>
    <svg width="28" height="24" className="result-item-expando expanded">
      <g transform="translate(14 12)">
        <g className="expando-glyph">
          <polygon points="-1.7,-5 3.3,0 -1.7,5 -2.9,3.8 1,0 -2.9,-3.8"></polygon>
        </g>
      </g>
    </svg>
    <span className={ styles.YoYoLabelTitle }> 收起评论 </span>
  </div>
)

CloseIcon.propTypes = {
  onClick: func,
}

const YoYoCommentList = ({ list }) => (
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
)

YoYoCommentList.propTypes = {
  list: array,
}

const YoYoCommentBox = ({ text, onCommentTextChange, onEmailChange, onPublish }) => (
  <div className={ styles.YoYoBoxContainer }>
    <div className={ styles.YoYoInputArea }>
      <textarea
        className={ styles.YoYoComentTextArea }
        value={ text }
        onChange={ onCommentTextChange }
      />
    </div>
    <div className={ styles.YoYoUserAction }>
      <input
        className={ styles.YoYoEmailInput }
        type="text"
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
  </div>
)

YoYoCommentBox.propTypes = {
  text: string,
  onCommentTextChange: func,
  onEmailChange: func,
  onPublish: func,
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
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
      text,
    } = this.state

    if (!maybeEmailAddress(email)) {
      alert(`'${email}' is not a valid email`)
    } else if (!validateComment(text)) {
      alert(`'${text}' is not a valid comment`)
    } else {
      this.submit()
    }
  }

  openYoYo() {
    this.setState({ open: true })
  }

  closeYoYo() {
    this.setState({ open: false })
  }

  render() {
    const {
      list,
      text,
      open,
    } = this.state

    if (open) {
      return (
        <div className={ styles.YoYoContainer }>
          <CloseIcon onClick={ ::this.closeYoYo } />
          <YoYoCommentBox
            text={ text }
            onCommentTextChange={ ::this.commentTextChange }
            onEmailChange={ ::this.commentEmailChange }
            onPublish={ ::this.publish }
          />
          <YoYoCommentList list={ list } />
        </div>
      )
    }
    return (
      <div className={ styles.YoYoContainer }>
        <OpenIcon onClick={ ::this.openYoYo } />
      </div>
    )
  }
}

const COMMENTOR_ID = 'YoYo'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
