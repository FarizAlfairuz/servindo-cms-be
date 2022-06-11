const { Router } = require('express')
const { fileController } = require('../controllers')

const router = Router()

router.get('/files', fileController.getListFiles)
router.get('/files/:name', fileController.downloadFile)

module.exports = router