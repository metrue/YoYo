const Mailer = require('../mailer')

function withMailer(service) {
  const mailer = new Mailer(service)

  return (target) => {
    target.prototype.mailer = mailer
  }
}

module.exports = withMailer
