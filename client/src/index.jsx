import React from 'react'
import ReactDOM from 'react-dom'
import { EditorState, ContentState } from 'draft-js'
import { fromJS } from 'immutable'

import api from './api'
import styles from './styles.css'
import { maybeEmailAddress, validateComment } from './utils'
import CommentBox from './components/CommentBox'
import CommentItem from './components/CommentItem'
import SubmitButton from './components/SubmitButton'

const { func } = React.PropTypes

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

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: true,
      email: '',
      list: [],
      parents: [],
      suggestions: [],
      editorState: EditorState.createEmpty(),
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

    const uniqueMentionsByUser = (arr) => {
      const mentions = []
      const flag = {}
      for (const m of arr) {
        if (!flag[`${m.name}${m.link}`]) {
          mentions.push(m)
        }
        flag[`${m.name}${m.link}`] = true
      }
      return mentions
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
          suggestions: uniqueMentionsByUser(data.map(commentToMention).filter((c) => c !== null)),
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

  submit() {
    const {
      email,
      parents,
      editorState,
    } = this.state

    const text = editorState.getCurrentContent().getPlainText()

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
          this.reset()
        }
        return new Error(`${res.statusText}`)
      })
      .catch((e) => {
        console.error(`YoYo Got something wrong: ${e}, feedback to h.minghe@gmail.com would be great`)
      })
  }

  reset() {
    const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''))
    this.setState({ editorState })
  }

  publish() {
    const {
      email,
      editorState,
    } = this.state

    const text = editorState.getCurrentContent().getPlainText()
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
      this.setState({ parents: [...parents, id] })
    }
  }

  editorStateChange(editorState) {
    this.setState({ editorState })
  }

  resetEditorState() {
    const editorState = EditorState.createWithContent(ContentState.createFromText(''))
    this.setState({ editorState })
  }

  render() {
    const {
      list,
      email,
      open,
      suggestions,
      editorState,
    } = this.state

    const immutabaleSuggestions = fromJS(suggestions)

    if (open) {
      return (
        <div className={ styles.YoYoContainer }>
          <CloseIcon onClick={ ::this.closeYoYo } />
          <div className={ styles.YoYoBoxContainer }>
            <CommentBox
              editorState={ editorState }
              onEditorStateChange={ ::this.editorStateChange }
              suggestions={ immutabaleSuggestions }
              onAddMention={ ::this.reply }
            />
            <SubmitButton
              email={ email }
              onEmailChange={ ::this.commentEmailChange }
              onPublish={ ::this.publish }
            />
          </div>

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
