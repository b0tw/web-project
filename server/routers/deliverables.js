const express = require('express')
const router = express.Router();

router.post('/add', (req, res) => {
    projectId = req.body.projectId
    title = req.body.title
    description = req.body.description

    //validating the received data
    if (title === null || title.length > 20) {
        res.status(400).send({ "message": "Title is invalid" })
    }
    else if (description.length > 200) {
        res.status(400).send({ "message": "Description is too large" })
    }

    //creating the object
    let deliverable = {
        projectId,
        title,
        description
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

    //validate projectId


    if (title !== null && title.length < 10) {
        //update title in the db

    }

    if(description !== null && description.length <20){
        //update description in the db

    }
    res.status(400).send({"message":"db"})
})
module.exports = router