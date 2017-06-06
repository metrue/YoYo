const uniqueNames = (emails) => {
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

const appendUniqueName = (comments) => {
  const ret = []
  const isUnique = (name, domain) => {
    for (const comment of ret) {
      const dm = comment.user.split('@')[1]
      if (comment.name === name && dm !== domain) return false
    }
    return true
  }

  for (const comment of comments) {
    const [name, domain] = comment.user.split('@')
    let suffix = 1
    let newName = name
    while (!isUnique(newName, domain)) {
      newName = `${name}${suffix}`
      suffix += 1
    }
    ret.push({ ...comment, name: newName })
  }
  return ret
}

module.exports = { uniqueNames, appendUniqueName }
