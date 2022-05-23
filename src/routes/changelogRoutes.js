const { Router } = require('express')
const { changelogController } = require('../controllers')

const router = Router()

router.route('/changelog').get(changelogController.getChangelogs)

module.exports = router
