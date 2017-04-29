import nodemailer from 'nodemailer'

class Mailer {
  constructor(config) {
    const { service, user, pass } = config
    this.service = service
    this.user = user
    this.pass = pass

    const auth = { user, pass }
    this.transporter = nodemailer.createTransport({ service, auth })
  }

  async send(to, text) {
    const options = {
      from: `YoYo <${this.user}>`,
      to,
      subject: 'Reply notification - YoYo',
      text,
      html: text,
    }
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(options, (error, info) => {
        if (error) {
          reject(error)
        } else {
          resolve(info)
        }
      })
    })
  }
}

export default Mailer
