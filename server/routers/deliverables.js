const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/authentication-middleware');
const apiError = require('../entities/api-error');

// TODO: uncomment and test after session router is made
router.use(authMiddleware());

router.post('/add', (req, res) => {
    projectId = req.body.projectId
    title = req.body.title
    description = req.body.description
    link = req.body.link

    //validating the received data
    if (title === null || title.length > 20) {
        res.status(400).send(apiError.InvalidRequest);
    }
    else if (description.length > 200) {
        res.status(400).send(apiError.InvalidRequest);
    }
    else if(link ===null){
        res.status(400).send(apiError.InvalidRequest);
    }
    //creating the object
    let deliverable = {
        projectId,
        title,
        description,
        link
    }

    //storing it into the database


    //response (will be a message after the db is made)
    res.status(200).send(deliverable)
})

router.get('/get', (req, res) => {
    projectId = req.body.projectId

    //search in db


    res.status(200).send(projectId)
})

router.put('/update', (req, res) => {
    projectId = req.body.projectId
    title = req.body.title
    description = req.body.description
    link = req.body.link
    //validate projectId


    if (title !== null && title.length < 10) {
        //update title in the db

    }

    if(description !== null && description.length <20){
        //update description in the db

    }

    if(link !==null){
        //update link in the db
    }
    res.status(400).send({"message":"db"})
})

module.exports = router
