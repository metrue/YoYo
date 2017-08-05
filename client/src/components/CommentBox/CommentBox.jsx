import React from 'react'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'

import editorStyles from './styles.css'
import mentionsStyles from './mentionsStyles.css'

const mentionPlugin = createMentionPlugin({
  entityMutability: 'IMMUTABLE',
  theme: mentionsStyles,
  mentionPrefix: '@',
})

const suggestionsFilter = (searchValue, suggestions) => {
  const value = searchValue.toLowerCase()
  const filteredSuggestions = suggestions.filter((suggestion) => (
    !value || suggestion.get('name').toLowerCase().indexOf(value) > -1
  ))

  if (filteredSuggestions.size < 5) {
    return filteredSuggestions
  }
  return filteredSuggestions.setSize(5)
}

const { MentionSuggestions } = mentionPlugin
const plugins = [mentionPlugin]

const Entry = (props) => {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line no-unused-vars
    ...parentProps
  } = props

  return (
    <div { ...parentProps }>
      <div className={ theme.mentionSuggestionsEntryContainer }>
        <div className={ theme.mentionSuggestionsEntryContainerRight }>
          <div className={ theme.mentionSuggestionsEntryText }>
            { mention.get('name') }
          </div>
        </div>
      </div>
    </div>
  )
}

Entry.propTypes = {
  mention: React.PropTypes.object,
  theme: React.PropTypes.object,
  searchValue: React.PropTypes.string,
}

export default class CommentBox extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      suggestions: props.suggestions,
    }
  }

  onSearchChange = ({ value }) => {
    const { suggestions } = this.props
    this.setState({
      suggestions: suggestionsFilter(value, suggestions),
    })
  };

  onAddMention = (e) => {
    this.props.onAddMention(e.get('_id'))
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
  editorState: React.PropTypes.object,
  onEditorStateChange: React.PropTypes.func,
  suggestions: React.PropTypes.array,
  onAddMention: React.PropTypes.func,
  onContentChange: React.PropTypes.func,
}
