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
  object,
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

const Comment = ({ comment, onReply }) => {
  const handleReply = () => onReply(comment)

  return (
    <div className={ styles.YoYoCommentItemContainer }>
      <div className={ styles.YoYoCommentItemUserAndDate }>
        <div className={ styles.YoYoCommentItemUser }>
          { comment.user }
          <span className={ styles.YoYoCommentItemDate }> - { moment(comment.date).format('YYYY-MM-DD HH:MM') } </span>
        </div>
      </div>
      <div className={ styles.YoYoCommentItemText }>
        <p>
          { comment.text }
        </p>
      </div>
      <div className={ styles.YoYoReplyButtonContainer }>
        <button className={ styles.YoYoReplyButton } onClick={ handleReply }> reply </button>
      </div>
    </div>
  )
}

Comment.propTypes = {
  comment: object,
  onReply: func,
}

const YoYoCommentList = ({ list, onReply }) => (
  <div className={ styles.YoYoCommentListContainer }>
    {
      list.map(c => <Comment comment={ c } onReply={ onReply } />)
    }
  </div>
)

YoYoCommentList.propTypes = {
  list: array,
  onReply: func,
}

const YoYoCommentBox = ({ text, onCommentTextChange, onEmailChange, onPublish }) => (
  <div className={ styles.YoYoBoxContainer }>
    <div className={ styles.YoYoInputArea }>
      <textarea
        className={ styles.YoYoCommentTextArea }
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
      parents: [],
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
      parents,
    } = this.state

    api.submit({
      user: email,
      date: (new Date()).toISOString(),
      uri: window.location.href,
      parents,
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

  reply(comment) {
    const { _id, user } = comment
    const { parents, text } = this.state

    if (parents.indexOf(_id) === -1) {
      this.setState({
        parents: [...parents, _id],
        text: `@${user} ${text}`,
      })
    }
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
          <YoYoCommentList
            list={ list }
            onReply={ ::this.reply }
          />
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
