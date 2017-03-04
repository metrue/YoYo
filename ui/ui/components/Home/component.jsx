import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import actions from './actions'
import styles from './style.css'

import SearchBox from './SearchBox'
import LabelCards from './LabelCards'
import Entries from './Entries'

const {
  string,
  bool,
  array,
  object,
} = React.PropTypes

// Container Component
function mapState(state) {
  return {
    list: state.getIn(['home', 'list']),
    searching: state.getIn(['home', 'searching']),
    searched: state.getIn(['home', 'searched']),
    queryString: state.getIn(['home', 'queryString']),
  }
}

function mapDispatch(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) }
}

@connect(mapState, mapDispatch)
export default class Categories extends React.Component {
  componentWillMount() {
    this.handleSearch = this.search.bind(this)
  }

  search(qs) {
    const query = { search: qs }
    this.props.actions.search(query)
  }

  render() {
    const {
      searching,
      searched,
      list,
      queryString,
    } = this.props

    if (searching) {
      return <div> searching </div>
    }

    if (searched) {
      return (
        <div className={ styles.homeContainer }>
          <SearchBox onSubmit={ this.handleSearch } queryString={ queryString } />
          <Entries list={ list } />
        </div>
      )
    }

    const titles = ['生育收养', '户籍办理', '民族宗教']

    return (
      <div className={ styles.homeContainer }>
        <SearchBox onSubmit={ this.handleSearch } queryString={ queryString } />
        <LabelCards titles={ titles } />
      </div>
    )
  }
}

Categories.propTypes = {
  list: array,
  searching: bool,
  searched: bool,
  queryString: string,
  actions: object,
}
