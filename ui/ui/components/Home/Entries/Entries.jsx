import { Link } from 'react-router'

import styles from './style.css'

const {
  array,
  object,
} = React.PropTypes

const Entry = ({ entry }) => (
  <div className={ styles.entryContainer }>
    <Link to={ `/entry/${entry._id}` }>
      <p>{ entry.title }</p>
    </Link>
    <div className={ styles.locationContainer }>
      <p> { entry.city || '上海' } </p>
    </div>
  </div>
)

Entry.propTypes = ({
  entry: object,
})

const Entries = ({ list }) => (
  <div className={ styles.entriesContainer } >
    {
      list.map((entry, index) => (
        <Entry key={ index } entry={ entry } />
      ))
    }
  </div>
)

Entries.propTypes = ({
  list: array,
})

export default Entries
