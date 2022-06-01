const { Router } = require('express')
const { incomeController } = require('../controllers')
const { checkRole } = require('../middlewares')

const router = Router()

router
  .route('/incomes')
  .get(checkRole(['superadmin', 'finance']), incomeController.getIncomes)

module.exports = router
