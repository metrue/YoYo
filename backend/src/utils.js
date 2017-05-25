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
      if (comment.name === name) return false
    }
    return true
  }

  for (const comment of comments) {
    const [name] = comment.user.split('@')
    let suffix = 1
    let newName = name
    while (!isUnique(newName)) {
      newName = `${name}${suffix}`
      suffix += 1
    }
    ret.push({ ...comment, name: newName })
  }
  return ret
}
