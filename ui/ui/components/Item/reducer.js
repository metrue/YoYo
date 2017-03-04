import { Map } from 'immutable'

import types from './types'
const {
  FETCH,
  FETCH_SECCESS,
  FETCH_FAILED,
} = types


const reducer = {
  name: 'item',
  init: new Map({
    data: {},
    fetching: false,
  }),
  reduce(state = reducer.init, action) {
    switch (action.type) {
      case FETCH: {
        return state
          .set('fetching', true)
      }

      case FETCH_SECCESS: {
        const { data } = action.payload
        return state
          .set('fetching', false)
          .set('data', data)
      }

      case FETCH_FAILED: {
        return state
          .set('fetching', false)
      }

      default: return state
    }
  },
}

export default reducer
