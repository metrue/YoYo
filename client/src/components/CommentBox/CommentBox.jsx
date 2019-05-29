import React from 'react'
import PropTypes from 'prop-types'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from 'draft-js-mention-plugin'

import editorStyles from './styles.css'
import mentionsStyles from './mentionsStyles.css'
import 'draft-js-mention-plugin/lib/plugin.css'

const mentionPlugin = createMentionPlugin({
  entityMutability: 'IMMUTABLE',
  theme: mentionsStyles,
  mentionPrefix: '@',
})

const { MentionSuggestions } = mentionPlugin
const plugins = [mentionPlugin]

const Entry = (props) => {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line no-unused-vars
    ...parentProps,
  } = props

  return (
    <div { ...parentProps }>
      <div className={ theme.mentionSuggestionsEntryContainer }>
        <div className={ theme.mentionSuggestionsEntryContainerRight }>
          <div className={ theme.mentionSuggestionsEntryText }>
            { mention.name }
          </div>
        </div>
      </div>
    </div>
  )
}

Entry.propTypes = {
  mention: PropTypes.object,
  theme: PropTypes.object,
  searchValue: PropTypes.string,
}

export default class CommentBox extends React.Component {
  constructor(props) {
    super(props)

    const { suggestions } = props
    this.state = {
      suggestions,
    }
  }

  onSearchChange = ({ value }) => {
    const { suggestions } = this.props
    this.setState({
      suggestions: defaultSuggestionsFilter(value, suggestions),
    })
  };

  onAddMention = (e) => {
    this.props.onAddMention(e.id)
  }

  focus = () => {
    this.editor.focus()
  };

  render() {
    return (
      <div className={ editorStyles.editor } onClick={ this.focus }>
        <Editor
          editorState={ this.props.editorState }
          onChange={ this.props.onEditorStateChange }
          plugins={ plugins }
          ref={ (element) => { this.editor = element } }
        />
        <MentionSuggestions
          onSearchChange={ this.onSearchChange }
          suggestions={ this.state.suggestions }
          onAddMention={ this.onAddMention }
          entryComponent={ Entry }
        />
      </div>
    )
  }
}

CommentBox.propTypes = {
  editorState: PropTypes.object,
  onEditorStateChange: PropTypes.func,
  suggestions: PropTypes.array,
  onAddMention: PropTypes.func,
  onContentChange: PropTypes.func,
}
