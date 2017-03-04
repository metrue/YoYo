import fetch from 'isomorphic-fetch'
import { API_HOST } from '../config/config.js'
import qs from 'qs'

async function fetchJSON(url, opt) {
  try {
    const resp = await fetch(url, opt)
    if (resp.status >= 400) {
      throw new Error(`Bad response from server: ${resp.statusText}`)
    }
    // update workflow server npm version
    const data = await resp.json()
    return { data }
  } catch (error) {
    console.warn(error)
    return { error }
  }
}

export function toQueryString(obj, opt = {}) {
  const options = opt
  if (!opt.skipValues) options.skipValues = []
  if (!opt.skipKeys) options.skipKeys = []

  const newObject = obj
  for (const [k, v] of Object.entries(obj)) {
    if (options.skipValues.indexOf(v) !== -1 || options.skipKeys.indexOf(k) !== -1) {
      delete newObject[k]
    }
  }
  return qs.stringify(newObject)
}

class API {
  constructor(apiServer) {
    this.apiServer = apiServer
  }

  async fetchCategories() {
    const url = `${this.apiServer}/categories`
    return await fetchJSON(url)
  }

  * search(query) {
    // TODO this is not actual api
    const url = `${this.apiServer}/entries?${toQueryString(query)}`
    return yield fetchJSON(url)
  }

  * fetchEntry(id) {
    const url = `${this.apiServer}/entry/${id}?all=1`
    return yield fetchJSON(url)
  }
}

export default new API(API_HOST)
