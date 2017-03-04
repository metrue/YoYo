import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import actions from './actions'
import ModalInput from './components/modal_input'

const {
  bool,
  array,
  object,
  func,
} = React.PropTypes

// Container Component
function mapState(state) {
  return {
    list: state.getIn(['categories', 'list']),
    fetching: state.getIn(['gas', 'fetching']),
  }
}

function mapDispatch(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) }
}

@connect(mapState, mapDispatch)
export default class Categories extends React.Component {
  componentDidMount() {
    this.props.actions.fetch()
  }

  render() {
    const { fetching, list } = this.props

    if (fetching) {
      return <div> fetching </div>
    }

    return (
      <div className="categories-view">
        <ul>
          {
            list.map((item, index) => <li index={ index }> { item } </li>)
          }
        </ul>
      </div>
    )
  }
}

Categories.propTypes = {
  list: array,
  isFetching: bool,
  actions: object,
}

