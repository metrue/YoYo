import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import actions from './actions'
import styles from './style.css'

const {
  object,
  string,
  bool,
  shape,
} = React.PropTypes

const ParagrapText = ({ text }) => {
  if (text) {
    return (
      <div>
      {
        text.split('\n').map((t, i) => (
          <span key={ i }> { t } <br /> </span>
        ))
      }
      </div>
    )
  }
  return <div />
}

ParagrapText.propTypes = {
  text: string,
}

const Item = ({ item }) => (
  <div className={ styles.itemContainer }>
    <h1> { item.title } </h1>
    <div className={ styles.sectionContainer }>
      <h2> { item.whenAndWhere }</h2>
      <ParagrapText text={ item.whenAndWhereHtml } />
    </div>
    <div className={ styles.sectionContainer }>
      <h2> { item.requirements }</h2>
      <ParagrapText text={ item.requirementsHtml } />
    </div>
    <div className={ styles.sectionContainer }>
      <h2> { item.meterials }</h2>
      <ParagrapText text={ item.meterialsHtml } />
    </div>
    <div className={ styles.sectionContainer }>
      <h2> { item.steps }</h2>
      <ParagrapText text={ item.stepsHtml } />
    </div>
    <div className={ styles.sectionContainer }>
      <h2> { item.accordingTo }</h2>
      <ParagrapText text={ item.accordingToHtml } />
    </div>
    <div className={ styles.sectionContainer }>
      <h2> { item.extra }</h2>
      <ParagrapText text={ item.extraHtml } />
    </div>
  </div>
)

Item.propTypes = {
  item: object,
}

function mapState(state) {
  return {
    item: state.getIn(['item', 'data']),
    fetching: state.getIn(['item', 'fetching']),
  }
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

@connect(mapState, mapDispatch)
class ItemContainer extends React.Component {
  componentDidMount() {
    const { id } = this.props.params
    this.props.actions.fetch(id)
  }

  render() {
    const { fetching, item } = this.props

    if (fetching) {
      return <div> fetching </div>
    }

    return (
      <div className={ styles.itemContainer }>
        <Item item={ item } />
      </div>
    )
  }
}

ItemContainer.propTypes = {
  actions: object,
  params: shape({
    id: string,
  }),
  fetching: bool,
  item: object,
}

export default ItemContainer
