import fetch from 'isomorphic-fetch'
import { API_HOST, DOMAIN } from '../config'
import Cookies from 'js-cookie'

const withTokenFetch = (url, options) => {
  const token = Cookies.get('yoyo_admin_token')
  const opts = Object.assign({}, options)
  if (!opts.method) {
    opts.method = 'GET'
  }
  if (!opts.headers) {
    opts.headers = {}
  }
  if (token) opts.headers.Authorization = `Bearer ${token}`
  return fetch(url, opts)
}

class API {
  async query(domain = DOMAIN) {
    const url = `${API_HOST}/admin/comments?uri=${encodeURIComponent(domain)}`
    return withTokenFetch(url)
  }

  async delete(id) {
    const url = `${API_HOST}/admin/comments/${id}`
    const opt = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    return withTokenFetch(url, opt)
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
    return withTokenFetch(url, opt)
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
    return withTokenFetch(url, opt)
  }
}

export default new API()
