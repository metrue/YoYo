const TOKEN_NAME = 'YOYO_ADMIN_TOKEN'

export const getToken = (ctx) => {
  return ctx.cookies.get(TOKEN_NAME)
}

export const setToken = (ctx, value) => {
  const expiresDate = new Date()
  expiresDate.setDate(expiresDate.getDate() + 30)

  ctx.cookies.set(TOKEN_NAME, value, {
    httpOnly: false,
    expires: expiresDate,
  })
}
