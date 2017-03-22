import React from 'react'
import ReactDOM from 'react-dom'
import { Editor, EditorState } from 'draft-js'

import styles from './styles.css'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editorState: EditorState.createEmpty(),
    }
  }

  change(editorState) {
    this.setState({ editorState })
  }

  submit() {
    const { editorState } = this.state
    const content = editorState.getCurrentContent()
  }
  render() {
    return (
      <div className={ styles.container }>
        <Editor
          editorState={ this.state.editorState }
          onChange={ ::this.change }
        />
        <button onClick={ ::this.submit }> Submit </button>
      </div>
    )
  }
}

const COMMENTOR_ID = 'commentor-id'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
