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
    api.fetch(window.location.href)
      .then((res) => {
        if (res.status === 200) {
          return res.json()
        }
        return new Error(`${res.statusText}`)
      })
      .then((data) => {
        this.setState({ list: data })
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
      text: value,
    }).then((res) => {
      if (res.status === 200) {
        return res.json()
      }
      console.warn(`${res.status} - ${res.statusText}`)
      return new Error(`${res.statusText}`)
    }).then((data) => {
      console.log(data)
    }).catch((e) => {
      console.warn(e)
    })
  }

  render() {
    const { list } = this.state
    console.log(JSON.stringify(list, null, 2))
    return (
      <div>
        <div className="CommentListContainer">
          <ul>
            {
              list.map(c => <li> { c.text } - { c.date } </li>)
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
