const express = require('express')
const router = express.Router()

const deliverableRouter = require('./deliverables')
const teamsRouter = require('./teams')

router.use('/deliverable', deliverableRouter)

router.use('/teams', teamsRouter)

module.exports = router;