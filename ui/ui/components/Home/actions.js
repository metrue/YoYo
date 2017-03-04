import types from './types'

const {
  SEARCH,
} = types

const actions = {
  search: (query) => ({
    type: SEARCH,
    payload: {
      query,
    },
  }),
}

export default actions
