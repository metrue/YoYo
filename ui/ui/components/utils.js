import moment from 'moment'
import qs from 'qs'

export function equalOptions(obj1, obj2) {
  const keys = Object.keys(obj1)
  if (keys.length !== Object.keys(obj2).length) return false

  for (const p of keys) {
    if (!obj2.hasOwnProperty(p)) return false

    if (typeof obj1[p] === 'object') {
      if (obj1[p] instanceof Array) {
        if (obj1[p].length !== obj2[p].length) return false
        for (let i = 0; i < obj1[p].length; i++) {
          if (!equalOptions(obj1[p][i], obj2[p][i])) return false
        }
      } else {
        if (!equalOptions(obj1[p], obj2[p])) return false
      }
    } else {
      if (obj1[p] !== obj2[p]) return false
    }
  }

  return true
}

export function removePropertyOfObject(obj, values = []) {
  const newObj = obj
  for (const key of Object.keys(obj)) {
    if (obj.hasOwnProperty(key) && values.indexOf(obj[key])) {
      delete newObj[key]
    }
  }

  return newObj
}

export function leftpad(str, len) {
  let newStr = str
  if (str.length >= len) {
    return newStr
  }

  for (let i = len - 1; i > 0; i--) {
    if (str[i] === undefined) {
      newStr = ` ${newStr}`
    }
  }

  return newStr
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

export function formatTime(time) {
  if (!time) return ''
  try {
    return moment(time).format('YYYY-MM-DD HH:mm:ss.SSS')
  } catch (e) {
    return '-'
  }
}

export function humanizeDuration(sTime, eTime) {
  if (!sTime || !eTime) return '-'
  let diff = new Date(eTime).getTime() - new Date(sTime).getTime()
  if (isNaN(diff)) return '-'
  if (diff < 0) return 'time travel'

  const ms = diff % 1000
  diff = parseInt(diff / 1000, 10)
  const seconds = diff % 60
  diff = parseInt(diff / 60, 10)
  const minutes = diff % 60
  const hours = parseInt(diff / 60, 10)

  let duration = ''
  if (hours > 0) duration += `${hours}h `
  if (minutes > 0) duration += `${minutes}m `
  if (seconds > 0) duration += `${seconds}s `
  duration += `${ms}ms`
  return duration
}

export default module.exports
