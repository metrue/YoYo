import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  render() {
    return (
      <div>
        hello
      </div>
    )
  }
}

const COMMENTOR_ID = 'commentor-id'
const node = document.getElementById(COMMENTOR_ID)
ReactDOM.render(<App />, node)
