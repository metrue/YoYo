export function maybeEmailAddress(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export function validateComment(text) {
  // TODO sanitize check, -- too weak now
  return text && text.length > 0
}

export function commentToMention(comment) {
  const { user, _id } = comment
  const [name, link] = user.split('@')
  if (name && link) {
    return { name, link, avatar: '', _id }
  }
  return null
}

export function uniqueMentionsByUser(arr) {
  const mentions = []
  const flag = {}
  for (const m of arr) {
    if (!flag[`${m.name}${m.link}`]) {
      mentions.push(m)
    }
    flag[`${m.name}${m.link}`] = true
  }
  return mentions
}
