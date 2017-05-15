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
  commentToMention,
  uniqueMentionsByUser,
} from './utils'

class App extends React.Component {
  state = {
    email: '',
    list: [],
    parents: [],
    suggestions: [],
    editorState: EditorState.createEmpty(),
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

  commentEmailChange = (e) => {
    const value = e.target.value
    this.setState({
      email: value,
    })
  }

  submit = () => {
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

  reset = () => {
    const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''))
    this.setState({ editorState })
  }

  publish = () => {
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

  mention = (id) => {
    const { parents } = this.state

    if (parents.indexOf(id) === -1) {
      this.setState({ parents: [...parents, id] })
    }
  }

  editorStateChange = (editorState) => {
    this.setState({ editorState })
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
            onEditorStateChange={ this.editorStateChange }
            suggestions={ immutabaleSuggestions }
            onAddMention={ this.mention }
          />
          <SubmitButton
            email={ email }
            onEmailChange={ this.commentEmailChange }
            onPublish={ this.publish }
          />
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
