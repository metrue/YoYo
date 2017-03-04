import types from './types'

const {
  FETCH,
} = types

const actions = {
  fetch: (id) => ({
    type: FETCH,
    payload: {
      id,
    },
  }),
}

export default actions
