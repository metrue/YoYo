import Mailer from '../mailer'

export function withMailer(service) {
  const mailer = new Mailer(service)

  return (target) => {
    target.prototype.mailer = mailer
  }
}
