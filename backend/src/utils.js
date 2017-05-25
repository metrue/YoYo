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
