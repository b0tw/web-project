const express = require('express');
const router = express.Router();
const deliverableRouter = require('./deliverables');
const sessionsRouter = require('./sessions');
const juriesRouter = require('./juries');

router.use('/deliverable', deliverableRouter);
router.use('/sessions', sessionsRouter);
router.use('grades', juriesRouter);

module.exports = router;
