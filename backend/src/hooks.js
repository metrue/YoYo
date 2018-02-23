const Mailer = require('./mailer')

const appendModFlag = (adminEmail) => {
  return (comment) => {
    if (comment.user === adminEmail) {
      return Object.assign(comment, { mod: true })
    }
    return Object.assign(comment, { mod: false })
  }
}

const notifyAdmin = (mailer, adminEmail) => {
  return async (createdComment) => {
    const { user, text, uri } = createdComment

    if (adminEmail) {
      const content = `@${user}: ${text} - ${uri}`
      await mailer.send(adminEmail, content)
    }
  }
}

const notifyCommentor = (mailer) => {
  return async (createdComment, replyedComment) => {
    const { text, uri } = createdComment
    if (replyedComment && replyedComment.user) {
      const appedUriText = `${text} - ${uri}`
      await mailer.send(replyedComment.user, appedUriText)
    }
  }
}

module.exports = (config) => {
  const { adminEmail, mail } = config
  const mailer = new Mailer(mail)

  return {
    preCreated: [
      appendModFlag(adminEmail)
    ],
    postCreated: [
      notifyAdmin(mailer, adminEmail),
      notifyCommentor(mailer, adminEmail)
    ]
  }
}
