const { config } = require('../config/env.cjs')

const stateChangingMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

function isTrustedOrigin(origin) {
  return config.allowedOrigins.includes(origin)
}

function enforceTrustedOrigin(req, res, next) {
  if (!stateChangingMethods.has(req.method)) {
    return next()
  }

  const secFetchSite = String(req.headers['sec-fetch-site'] || '').toLowerCase()
  if (secFetchSite === 'cross-site') {
    return res.status(403).json({ message: 'Cross-site requests are not allowed.' })
  }

  const origin = String(req.headers.origin || '').trim()
  if (!origin) {
    return next()
  }

  if (!isTrustedOrigin(origin)) {
    return res.status(403).json({ message: 'Untrusted request origin.' })
  }

  return next()
}

module.exports = { enforceTrustedOrigin, isTrustedOrigin }
