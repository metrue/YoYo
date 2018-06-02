import React from 'react'
import ReactDOM from 'react-dom'
import { EditorState, ContentState } from 'draft-js'
import { fromJS } from 'immutable'

import api from './api'
import styles from './styles.css'
import CommentBox from './components/CommentBox'
import CommentItem from './components/CommentItem'
import SubmitButton from './components/SubmitButton'
import {
  maybeEmailAddress,
  validateComment,
  appendUniqueName,
} from './utils'

const CommentList = ({ list }) => (
  <div className={ styles.YoYoCommentListContainer } >
    {
      list.map(c => <CommentItem comment={ c } />)
    }
  </div>
)

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      email: '',
      publishing: false,
      list: [],
      parents: [],
      suggestions: [],
      editorState: EditorState.createEmpty(),
    }
  }

  componentDidMount() {
    this.fetchCommentList()
  }

  async fetchCommentList() {
    const resp = await api.query(window.location.href)
    if (resp.status !== 200) {
      throw new Error(`${resp.status}: ${resp.statusText}`)
    }
    const comments = await resp.json()
    const commentToMention = (c) => ({ name: c.email, avatar: '', _id: c.id })
    const suggestions = comments.map(c => commentToMention(c)).filter(c => c !== null)
    this.setState({ list: comments, suggestions })
  }

  commentEmailChange(e) {
    const email = e.target.value
    this.setState({ email })
  }

  submit() {
    const {
      email,
      parents,
      list,
      editorState,
    } = this.state

    const text = editorState.getCurrentContent().getPlainText()
    const item = {
      email,
      date: (new Date()).toISOString(),
      uri: window.location.href,
      parents,
      text,
    }
    this.setState({
      list: [...list, appendUniqueName(item)],
    })
    api.submit(item).then((res) => {
      if (res.status === 201) {
        setTimeout(() => {
          this.fetchCommentList()
        }, 0)
        this.reset()
      }
      return new Error(`${res.statusText}`)
    }).catch((e) => {
      console.error(`YoYo Got something wrong: ${e}, feedback to h.minghe@gmail.com would be great`)
    })
  }

  reset() {
    const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''))
    this.setState({ editorState, publishing: false })
  }

  publish() {
    const {
      email,
      editorState,
      publishing,
    } = this.state

    if (!publishing) {
      const text = editorState.getCurrentContent().getPlainText()
      if (!maybeEmailAddress(email)) {
        window.alert(`'${email}' is not a valid email`)
      } else if (!validateComment(text)) {
        window.alert(`'${text}' is not a valid comment`)
      } else {
        this.setState({ publishing: true }, () => {
          this.submit()
        })
      }
    }
  }

  mention(id) {
    const { parents } = this.state

    if (parents.indexOf(id) === -1) {
      this.setState({ parents: [...parents, id] })
    }
  }

  editorStateChange(editorState) {
    this.setState({ editorState })
  }

  render() {
    const {
      list,
      email,
      suggestions,
      editorState,
    } = this.state

    const immutabaleSuggestions = fromJS(suggestions)

    return (
      <div className={ styles.YoYoContainer }>
        <div className={ styles.YoYoBoxContainer }>
          <CommentBox
            editorState={ editorState }
            onEditorStateChange={ this.editorStateChange.bind(this) }
            suggestions={ immutabaleSuggestions }
            onAddMention={ this.mention.bind(this) }
          />
          <SubmitButton
            email={ email }
            onEmailChange={ this.commentEmailChange.bind(this) }
            onPublish={ this.publish.bind(this) }
          />
        </div>
        {
          list.length > 0 ? <CommentList list={ list } /> : null
        }
      </div>
    )
  }
}

const COMMENTOR_ID = 'YoYo'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
