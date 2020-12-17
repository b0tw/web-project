const express = require('express')
const router = express.Router()
const deliverableRouter = require('./deliverables')
const teamsRouter = require('./teams')
const sessionsRouter = require('./sessions');

router.use('/deliverable', deliverableRouter);
router.use('/teams', teamsRouter);
router.use('/sessions', sessionsRouter);

module.exports = router;
