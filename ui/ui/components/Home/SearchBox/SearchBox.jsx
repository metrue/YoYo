import styles from './style.css'

class SearchBox extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inputValue: props.queryString,
    }
  }

  componentWillMount() {
    this.handleInputChange = this.onInputChange.bind(this)
    this.handleSubmit = this.submit.bind(this)
    this.handleKeyPress = this.keyPress.bind(this)
  }

  onInputChange(event) {
    this.setState({
      inputValue: event.target.value,
    })
  }

  submit() {
    const { inputValue } = this.state
    const { onSubmit } = this.props
    onSubmit(inputValue)
  }

  keyPress(evt) {
    if (evt.charCode === 13) {
      this.submit()
    }
  }

  render() {
    const { inputValue } = this.state

    return (
      <div className={ styles.searchBoxContainer } onKeyPress={ this.handleKeyPress }>
        <input
          ref="searchInput"
          className={ `${styles.searchInput} ${styles.inputHover}` }
          placeholder="搜点什么"
          onChange={ this.handleInputChange }
          value={ inputValue }
        />
        <span
          className={ styles.searchIcon }
          onClick={ this.handleSubmit }
        >
          <i className="fa fa-search" />
        </span>
      </div>
    )
  }
}

const {
  func,
  string,
} = React.PropTypes

SearchBox.propTypes = {
  onSubmit: func,
  queryString: string,
}

export default SearchBox
