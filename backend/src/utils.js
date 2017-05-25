export const uniqueNames = (emails) => {
  const names = []
  emails.forEach((email) => {
    let [name] = email.split('@')
    let suffix = 1
    while (names.indexOf(name) !== -1) {
      name = `${name}${suffix}`
      suffix += 1
    }
    names.push(name)
  })
  return names
}

export const appendUniqueName = (comments) => {
  const ret = []
  const isUnique = (name) => {
    for (const comment of ret) {
      if (comment.user.split('@')[0] === name) return false
    }
    return true
  }

  for (const comment of comments) {
    let [name] = comment.user.split('@')
    let suffix = 1
    while (!isUnique(name)) {
      name = `${name}${suffix}`
      suffix += 1
    }
    ret.push({ ...comment, name })
  }
  return ret
}
