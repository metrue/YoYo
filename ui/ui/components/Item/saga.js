import types from './types'

import { takeLatest } from 'redux-saga'
import { put, call } from 'redux-saga/effects'

import api from '../../api'

const {
  FETCH,
  FETCH_FAILED,
  FETCH_SECCESS,
} = types

function* fetcher(action) {
  const { id } = action.payload

  const { error, data } = yield call([api, api.fetchEntry], id)
  if (error) {
    yield put({
      type: FETCH_FAILED,
      payload: {
        meesage: error,
      },
    })
  } else {
    yield put({
      type: FETCH_SECCESS,
      payload: {
        data,
      },
    })
  }
}

function* fetchSaga() {
  yield* takeLatest(FETCH, fetcher)
}

const watchers = [fetchSaga]
const workers = [fetcher]

export { watchers, workers }
