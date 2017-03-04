export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function delay(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

export function types(struct, pre = '') {
  const ret = {}
  const keys = Object.keys(struct)

  for (const k of keys) {
    let v = struct[k]
    v = v ? types(v, `${k}.`) : `${pre}${k}`
    ret[k] = v
  }

  return ret
}
