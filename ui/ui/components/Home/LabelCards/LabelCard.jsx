import styles from './style.css'
import api from '../../../api'

const {
  string,
  array,
} = React.PropTypes

const LabelCard = ({ title }) => (
  <div className={ styles.labelCardContainer }>
    <p>
    { title }
    </p>
  </div>
)

LabelCard.propTypes = {
  title: string,
}

class LabelCards extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      titles: props.titles,
    }
  }

  componentDidMount() {
    const st = setInterval(async () => {
      if (this.unmounted) {
        clearInterval(st)
      } else {
        const { error, data } = await api.fetchCategories()
        if (!error) {
          const len = data.length
          const titles = []
          for (let i = 0; i < 3; i++) {
            const rand = Math.floor(Math.random() * len)
            titles.push(data[rand])
          }
          this.setState({ titles })
        }
      }
    }, 3000)
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  render() {
    const { titles } = this.state

    return (
      <div className={ styles.labelCardsContainer }>
        {
          titles.map((t, i) => <LabelCard title={ t } key={ i } />)
        }
      </div>
    )
  }
}

LabelCards.propTypes = {
  titles: array,
}

export default LabelCards
