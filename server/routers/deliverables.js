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


    //response
    res.status(200).send(deliverable)
})

module.exports = router