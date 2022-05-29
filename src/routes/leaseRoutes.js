const { Router } = require('express')
const { leaseController } = require('../controllers')
const { checkRole } = require('../middlewares')

const router = Router()

router
  .route('/leases')
  .post(
    checkRole(['superadmin', 'marketing']),
    leaseController.createLease
  )
  .get(checkRole(['superadmin', 'marketing']), leaseController.getLeases)

module.exports = router