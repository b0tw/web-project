const express = require('express');
const router = express.Router();
const deliverableRouter = require('./deliverables');
const sessionsRouter = require('./sessions');

router.use('/deliverable', deliverableRouter);
router.use('/sessions', sessionsRouter);

module.exports = router;
