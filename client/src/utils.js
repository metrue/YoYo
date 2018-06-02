export function maybeEmailAddress(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export function validateComment(text) {
  // TODO sanitize check, -- too weak now
  return text && text.length > 0
}

export function appendUniqueName(comment) {
  const [name] = comment.email.split('@')
  return Object.assign(comment, { name })
}
