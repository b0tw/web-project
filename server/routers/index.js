const express = require('express')
const router = express.Router()
<<<<<<< HEAD
const deliverableRouter = require('./deliverables')
const teamsRouter = require('./teams')

router.use('/deliverable', deliverableRouter)
=======
const teamsRouter = require('./teams')

>>>>>>> Added the structure for the route
router.use('/teams', teamsRouter)

module.exports = router;