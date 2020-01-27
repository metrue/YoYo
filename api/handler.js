const sgMail = require('@sendgrid/mail')
const AWS = require('aws-sdk')
const uuid = require('uuid')
const Config = require('./config')
const KV = require('cloudkv').default
const { trimHTTPOrHTTPS } = require('./utils')

const {
  YOYO_EMAIL,
  SITE_OWNER_EMAIL,
  SENDGRID_API_KEY,
  DROPBOX_ACCESS_TOKEN,
} = Config

AWS.config.update({ region: 'us-east-1' })
sgMail.setApiKey(SENDGRID_API_KEY)

console.log('===>', KV, DROPBOX_ACCESS_TOKEN)
const kv = new KV({
  dbFile: '/YoYo.json',
  service: 'dropbox',
  token: DROPBOX_ACCESS_TOKEN,
})

function notify(to, options = {}) {
  const { uri, text } = options

  const textContent = `
Hi Friend, \r\n

New reply recieved from ${uri} \r\n\r\n
-----\r\n
 ${text}
\r\n-----\r\n\r\n

- YoYo
`
  const htmlContent = `
Hi Friend, <br>

New reply recieved from ${uri} <br><br>
-----<br>
 ${text}
<br>-----<br><br>

- YoYo
`
  const payload = {
    to,
    from: YOYO_EMAIL,
    replyTo: YOYO_EMAIL,
    subject: 'YoYo: New reply recieved',
    text: textContent,
    html: htmlContent,
  }
  sgMail.send(payload).then((data) => {
    console.log(`SEND OK: ${data}`)
  }).catch((e) => {
    // TODO handle a exception
    console.error(e)
  })
}

const response = (err, data = {}, cb) => {
  const resp = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(data),
  }
  cb(err, resp)
}

const isModerator = (email) => email === SITE_OWNER_EMAIL

const create = async (event, ctx, cb) => {
  const data = JSON.parse(event.body)
  const { email, uri, text, parents } = data
  const id = uuid.v1()
  const updatedAt = (new Date()).toISOString()

  const item = {
    email,
    uri: trimHTTPOrHTTPS(uri),
    text,
    id,
    mod: isModerator(email),
    updatedAt,
  }

  try {
    await kv.set(id, item);
    (parents || []).forEach(parent => {
      notify(parent, { uri, text })
    })

    if (SITE_OWNER_EMAIL) {
      notify(SITE_OWNER_EMAIL, { uri, text })
    }
    response(null, item, cb)
  } catch (e) {
    response(e, item, cb)
  }
}

const get = async (event, ctx, cb) => {
  const { id } = event.pathParameters
  try {
    const item = await kv.get(id)
    response(null, item, cb)
  } catch (e) {
    response(e, null, cb)
  }
}

const update = async (event, ctx, cb) => {
  const { id } = event.pathParameters
  const body = JSON.parse(event.body)
  const { uri, text, email } = body
  const updatedAt = (new Date()).toISOString()
  const item = {
    email,
    uri: trimHTTPOrHTTPS(uri),
    text,
    id,
    mod: isModerator(email),
    updatedAt,
  }

  try {
    await kv.set(id, item)
    response(null, item, cb)
  } catch (e) {
    response(e, item, cb)
  }
}

const query = async (event, ctx, cb) => {
  const { uri } = event.queryStringParameters
  const list = []
  let err
  try {
    const data = await kv.all()
    Object.keys(data).forEach((k) => {
      const item = data[k]
      if (item.uri === trimHTTPOrHTTPS(uri)) {
        list.push(item)
      }
    })
  } catch (e) {
    err = e
  }
  const items = list.sort((a, b) => {
    const au = a.updatedAt
    const bu = b.updatedAt
    if (au > bu) {
      return -1
    } else if (au < bu) {
      return 1
    }
    return 0
  })
  response(err, items, cb)
}

module.exports = {
  create,
  get,
  update,
  query,
}
