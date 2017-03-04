/*
 * exports a "setup" function that takes in a React component and an array of
 * components.  It'll then tie in the reducers and sagas of these components
 * into the redux middleware.
 */

require('babel-polyfill')

window.React = require('react')
const ReactDOM = require('react-dom')

import { Map } from 'immutable'

// redux
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux-immutable'

// redux saga
import createSagaMiddleware from 'redux-saga'
import { fork } from 'redux-saga/effects'

// router
import { hashHistory } from 'react-router'

export default function setup(App, components) {
  const sagas = []
  const reducers = {}
  let state = new Map({})

  for (const c of components) {
    const { saga, reducer } = c

    if (saga) {
      if (saga instanceof Array) {
        sagas.push(...saga)
      } else {
        saga.push(saga)
      }
    }

    if (reducer) {
      reducers[reducer.name] = reducer.reduce
      if (reducer.init) state = state.set(reducer.name, reducer.init)
    }
  }

  function* rootSaga() {
    yield sagas.map(s => fork(s))
  }

  const sagaMiddleware = createSagaMiddleware(rootSaga)
  const reducer = combineReducers(reducers)
  const store = createStore(reducer, state, applyMiddleware(sagaMiddleware))

  const ProviderApp = (
    <Provider store={ store }>
      <App history={ hashHistory } />
    </Provider>
  )

  return {
    reducer, store,
    render: node => ReactDOM.render(ProviderApp, node),
    App: ProviderApp,
  }
}
