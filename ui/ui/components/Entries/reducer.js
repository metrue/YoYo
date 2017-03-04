import { Map } from 'immutable'

import types from './types'
const {
  FETCH,
  FETCH_SECCESS,
  FETCH_FAILED,
} = types


const reducer = {
  name: 'categories',
  init: new Map({
    fetching: false,
    list: [],
  }),
  reduce(state = reducer.init, action) {
    switch (action.type) {
      case FETCH: {
        return state.set('fetching', true)
      }

      case FETCH_SECCESS: {
        const { categories } = action.payload
        return state
          .set('fetching', false)
          .set('list', categories)
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
