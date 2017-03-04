import { Map } from 'immutable'

import types from './types'
const {
  SEARCH,
  SEARCH_SECCESS,
  SEARCH_FAILED,
} = types


const reducer = {
  name: 'home',
  init: new Map({
    searching: false,
    searched: false,
    queryString: '',
    list: [],
  }),
  reduce(state = reducer.init, action) {
    switch (action.type) {
      case SEARCH: {
        const queryString = action.payload.query.search
        return state
          .set('queryString', queryString)
          .set('searching', true)
      }

      case SEARCH_SECCESS: {
        const { data } = action.payload
        return state
          .set('searching', false)
          .set('searched', true)
          .set('list', data.docs)
      }

      case SEARCH_FAILED: {
        return state
          .set('searched', false)
          .set('searching', false)
      }

      default: return state
    }
  },
}

export default reducer
