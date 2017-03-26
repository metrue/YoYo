import React from 'react'
import ReactDOM from 'react-dom'

import api from './api'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      list: [],
    }
  }

  componentDidMount() {
    api.fetch('https://minghe.me')
      .then((res) => {
        if (res.status === 200) {
          const { errorMessage } = res.data
          if (errorMessage) {
            console.warn(errorMessage)
          } else {
            this.setState({
              list: res.data && res.data.Items,
            })
          }
        }
        return new Error(`${res.statusText}`)
      })
      .catch((e) => {
        console.warn(e)
      })
  }

  change(e) {
    const value = e.target.value
    this.setState({
      value,
    })
  }

  submit() {
    const { value } = this.state
    api.submit({
      user: 'test-user-1',
      date: (new Date()).toISOString(),
      uri: window.location.href,
      content: value,
    }).then((res) => {
      if (res.status === 200) {
        const { errorMessage } = res.data
        if (errorMessage) {
          console.warn(errorMessage)
        } else {
          console.warn(res.data)
        }
      }
      console.warn(`${res.status} - ${res.statusText}`)
      return new Error(`${res.statusText}`)
    }).catch((e) => {
      console.warn(e)
    })
  }

  render() {
    const { list } = this.state
    return (
      <div>
        <div className="CommentListContainer">
          <ul>
            {
              list.map(c => <li> { c.content.S } - { c.date.S } </li>)
            }
          </ul>
        </div>
        <textarea onChange={ ::this.change } />
        <button onClick={ ::this.submit }> Submit </button>
      </div>
    )
  }
}

const COMMENTOR_ID = 'commentor-id'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
