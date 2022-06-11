const { Router } = require('express')
const { fileController } = require('../controllers')
const { checkRole } = require('../middlewares')

const router = Router()

router
  .route('/files')
  .get(checkRole(['superadmin', 'finance']), fileController.getListFiles)
router
  .route('/files/:name')
  .get(checkRole(['superadmin', 'finance']), fileController.downloadFile)

module.exports = router
