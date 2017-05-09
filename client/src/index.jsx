import React from 'react'
import ReactDOM from 'react-dom'

import api from './api'
import styles from './styles.css'
import { maybeEmailAddress, validateComment } from './utils'
import CommentBox from './components/CommentBox'
import CommentItem from './components/CommentItem'

const {
  array,
  string,
  func,
} = React.PropTypes

const OpenIcon = ({ onClick }) => (
  <div onClick={ onClick } className={ styles.YoYoOpenIcon }>
    <svg width="28" height="24">
      <g transform="translate(14 12)">
        <g className="expando-glyph">
          <polygon points="-1.7,-5 3.3,0 -1.7,5 -2.9,3.8 1,0 -2.9,-3.8"></polygon>
        </g>
      </g>
    </svg>
    <span className={ styles.YoYoLabelTitle }> Write a response... </span>
  </div>
)

OpenIcon.propTypes = {
  onClick: func,
}

const CloseIcon = ({ onClick }) => (
  <div onClick={ onClick } className={ styles.YoYoCloseIcon }>
    <svg width="28" height="24">
      <g transform="translate(14 12)">
        <g className="expando-glyph">
          <polygon points="-1.7,-5 3.3,0 -1.7,5 -2.9,3.8 1,0 -2.9,-3.8" transform="rotate(90)"></polygon>
        </g>
      </g>
    </svg>
  </div>
)

CloseIcon.propTypes = {
  onClick: func,
}

const YoYoCommentBox = ({
  email,
  suggestions,
  onCommentTextChange,
  onReply,
  onEmailChange,
  onPublish,
}) => (
  <div className={ styles.YoYoBoxContainer }>
    <CommentBox
      suggestions={ suggestions }
      onContentChange={ onCommentTextChange }
      onAddMention={ onReply }
    />
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
  </div>
)

YoYoCommentBox.propTypes = {
  text: string,
  suggestions: array,
  email: string,
  onCommentTextChange: func,
  onReply: func,
  onEmailChange: func,
  onPublish: func,
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: true,
      text: '',
      email: '',
      list: [],
      parents: [],
      suggestions: [],
    }
  }

  componentDidMount() {
    this.fetchCommentList()
  }

  fetchCommentList() {
    const commentToMention = (comment) => {
      const { user, _id } = comment
      const [name, link] = user.split('@')
      if (name && link) {
        return { name, link, avatar: '', _id }
      }
      return null
    }

    api.fetch(window.location.href)
      .then((res) => {
        if (res.status === 200) {
          return res.json()
        }
        return new Error(`${res.statusText}`)
      })
      .then((data) => {
        this.setState({
          list: data,
          suggestions: data.map(commentToMention).filter((c) => c !== null),
        })
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

  commentTextChange(text) {
    this.setState({
      text,
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
        if (res.status === 201) {
          setTimeout(() => {
            this.fetchCommentList()
          }, 0)
          this.setState({ text: '', email: '' })
        }
        return new Error(`${res.statusText}`)
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

  reply(id) {
    const { parents } = this.state

    if (parents.indexOf(id) === -1) {
      this.setState({
        parents: [...parents, id],
        // text: `@${user} ${text}`,
      })
    }
  }

  render() {
    const {
      list,
      text,
      email,
      open,
      suggestions,
    } = this.state

    if (open) {
      return (
        <div className={ styles.YoYoContainer }>
          <CloseIcon onClick={ ::this.closeYoYo } />
          <YoYoCommentBox
            text={ text }
            suggestions={ suggestions }
            email={ email }
            onCommentTextChange={ ::this.commentTextChange }
            onReply={ ::this.reply }
            onEmailChange={ ::this.commentEmailChange }
            onPublish={ ::this.publish }
          />
          <div className={ styles.YoYoCommentListContainer }>
            {
              list.map(c => <CommentItem comment={ c } />)
            }
          </div>
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
