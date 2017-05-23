import fetch from 'isomorphic-fetch'
import { API_HOST, DOMAIN } from '../config'

class API {
  async query(domain = DOMAIN) {
    const url = `${API_HOST}/admin/comments?uri=${encodeURIComponent(domain || DOMAIN)}`
    return fetch(url)
  }

  async delete(id) {
    const url = `${API_HOST}/admin/comments/${id}`
    const opt = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    return fetch(url, opt)
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

  async login(username, password) {
    const url = `${API_HOST}/admin/login`
    const opt = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
    return fetch(url, opt)
  }
}

export default new API()
