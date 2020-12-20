const express = require('express')
const router = express.Router()
const teamsRouter = require('./teams')
const sessionsRouter = require('./sessions');
const userRouter = require('./users')

router.use('/teams', teamsRouter);
router.use('/sessions', sessionsRouter);
router.use('/users', userRouter)

module.exports = router;
