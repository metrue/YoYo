import types from './types'

import { takeEvery, takeLatest } from 'redux-saga'
import { put, call } from 'redux-saga/effects'

import api from '../../api'

const {
  SEARCH,
  SEARCH_FAILED,
  SEARCH_SECCESS,
} = types

function* searcher(action) {
  const { query } = action.payload

  const { error, data } = yield call([api, api.search], query)
  if (error) {
    yield put({
      type: SEARCH_FAILED,
      payload: {
        meesage: error,
      },
    })
  } else {
    yield put({
      type: SEARCH_SECCESS,
      payload: {
        data,
      },
    })
  }
}

function* searchSaga() {
  yield* takeLatest(SEARCH, searcher)
}

const watchers = [searchSaga]
const workers = [searcher]

export { watchers, workers }
