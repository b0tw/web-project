const express = require('express')
const router = express.Router()
<<<<<<< HEAD
<<<<<<< HEAD
const deliverableRouter = require('./deliverables')
const teamsRouter = require('./teams')

router.use('/deliverable', deliverableRouter)
<<<<<<< HEAD
=======
const teamsRouter = require('./teams')

>>>>>>> Added the structure for the route
=======
>>>>>>> Added the structure for the route
=======
const teamsRouter = require('./teams')

>>>>>>> Added the structure for the route
router.use('/teams', teamsRouter)

module.exports = router;