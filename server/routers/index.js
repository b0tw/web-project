const express = require('express')
const router = express.Router()
<<<<<<< HEAD
const deliverableRouter = require('./deliverables')
const teamsRouter = require('./teams')

router.use('/deliverable', deliverableRouter)
<<<<<<< HEAD
=======
const teamsRouter = require('./teams')

>>>>>>> Added the structure for the route
=======
>>>>>>> bd7b8a584fd942ca2466680b4f5ea9275754ccc0
router.use('/teams', teamsRouter)

module.exports = router;