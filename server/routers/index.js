const express = require('express')
const router = express.Router()
const deliverableRouter = require('./deliverables')
const teamsRouter = require('./teams')
const sessionsRouter = require('./sessions');
const userRouter = require('./users')
const exceptionHandler = require('../middleware/exception-handling-middleware');

router.use(exceptionHandler());
router.use('/deliverables', deliverableRouter);
router.use('/teams', teamsRouter);
router.use('/sessions', sessionsRouter);
router.use('/users', userRouter)

module.exports = router;
