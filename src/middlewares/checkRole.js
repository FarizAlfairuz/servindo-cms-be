module.exports = (entitledRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated. No user.' })

  let haveAccess = false

  if (typeof entitledRoles !== 'string' && typeof entitledRoles !== 'object') {
    console.log('Invalid argument!')
    return res.sendStatus(500)
  }

  const userRole = String(req.user.role).toLowerCase()
  const entitledRolesStr = String(entitledRoles).toLowerCase()

  if (typeof entitledRoles === 'string' && userRole === entitledRolesStr) {
    haveAccess = true
  }

  if (typeof entitledRoles === 'object' && Array.isArray(entitledRoles)) {
    const isEntitled = entitledRoles.includes(userRole)
    if (isEntitled) haveAccess = true
  }

  if (!haveAccess) {
    return res.sendStatus(403)
  }

  return next()
}
