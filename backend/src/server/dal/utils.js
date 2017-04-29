import Mailer from '../mailer'
import CONFIG from '../../../config.json'

export function withMailer(target) {
  const mailer = new Mailer(CONFIG.mail)
  target.prototype.mailer = mailer
}
