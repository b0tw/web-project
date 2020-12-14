const express = require('express')
const router = express.Router()
const teamsRouter = require('./teams')

router.use('/teams', teamsRouter)

module.exports = router;