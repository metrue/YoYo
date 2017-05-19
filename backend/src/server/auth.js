import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const {
  YOYO_JWT_SECRET,
  YOYO_JWT_EXPIRES_IN,
} = process.env

const encrypt = (text) => {
  const cipher = crypto.createCipher('aes-256-ctr', YOYO_JWT_SECRET)
  let enc = cipher.update(text, 'utf8', 'hex')
  enc += cipher.final('hex')
  return enc
}

// eslint-disable-next-line
const decrypt = (text) => {
  const decipher = crypto.createDecipher('aes-256-ctr', YOYO_JWT_SECRET)
  let dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

export function sign(username, password) {
  const payload = {
    username,
    info: encrypt(password),
  }
  return jwt.sign(payload, YOYO_JWT_SECRET, { expiresIn: YOYO_JWT_EXPIRES_IN })
}

export function verify(token) {
  jwt.verify(token, YOYO_JWT_SECRET)
}

export default {
  sign,
  verify,
}
