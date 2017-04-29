import fetch from 'isomorphic-fetch'
import { API_HOST } from '../config'

class API {
  async fetch(uri) {
    const url = `${API_HOST}/comments?uri=${encodeURIComponent(uri)}`
    return fetch(url)
  }

  async submit(payload) {
    const url = `${API_HOST}/comments`
    const opt = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
    return fetch(url, opt)
  }
}

export default new API()
