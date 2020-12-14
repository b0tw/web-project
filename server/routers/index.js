const express = require('express')
const router = express.Router()
const deliverableRouter = require('./deliverables')

router.use('/deliverable', deliverableRouter)

module.exports = router;