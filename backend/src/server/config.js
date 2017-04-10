import CONFIG from '../../config.json'

/*
  return the merge object by combining o1 and o2,
  which is useful to override default config with user customized one.

  - if o1 and o2 has different types, return o1;
  - if o1 and o2 has the same type (not "dict" type), return o2;
  - if o1 and o2 are both "dict" type, apply the above rule recursively.
*/
function _mergeObject(o1, o2) {
  if (o1 === undefined || o1 === null) {
    return o2
  }

  if (o2 === undefined || o2 === null) {
    return o1
  }

  if (o1 === o2) {
    return o1
  }

  if (o1.constructor === Object && o2.constructor === Object) {
    const r = {}
    for (const k in o1) {
      r[k] = _mergeObject(o1[k], o2[k])
    }
    return r
  }

  if (o1.constructor === o2.constructor) {
    return o2
  }

  return o1
}

function _generateConfig(config) {
  const prodConfig = config.prod
  const envConfig = config[process.env[prodConfig.env_name]] || {}

  const newConfig = _mergeObject(prodConfig, envConfig)
  newConfig.jwt.secret += process.env[newConfig.jwt.env_name]
  return newConfig
}

export default _generateConfig(CONFIG)
