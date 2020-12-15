const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/authentication-middleware');
const apiError = require('../entities/api-error');

// TODO: uncomment and test after session router is made
router.use(authMiddleware());
const context = require('../entities/database/context')
const Deliverable = context.Deliverable
const Project = context.Project


router.get('/', async(req, res) => {
    id = req.query.id
    deliverable = await Deliverable.findOne({ where: { id } })

    if (deliverable !== null) {
        res.status(200).send({ deliverable })
    }
    else {
        res.status(400).send({ "message": "Deliverable or project not found" })
    }
})

router.post('/add', async (req, res) => {
    title = req.body.title
    description = req.body.description
    url = req.body.url
    project_id = req.body.project_id

    //validating the received data
    if (title === null || title.length > 20) {
        res.status(400).send(apiError.InvalidRequest);
    }
    else if (description.length > 200) {
        res.status(400).send(apiError.InvalidRequest);
    }
    else if(url ===null){
        res.status(400).send(apiError.InvalidRequest);
    }
    else {
        const checkProject = await Project.findOne({ where: { id: project_id } })
        if (checkProject === null) {
            res.status(400).send({ "message": "Project not found" })
        }
    }

    try {
        const del = await Deliverable.create({ title, description, url, project_id })

        res.status(200).send({ "message": del.title + " was created." })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ "message": "Something bad happened" })
    }

    try {
        const del = await Deliverable.create({ title, description, url, project_id })

        res.status(200).send({ "message": del.title + " was created." })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ "message": "Something bad happened" })
    }
})

router.put('/:id', async (req, res) => {
    id = req.params.id
    title = req.body.title
    description = req.body.description
    link = req.body.link
    project_id = req.body.project_id

    let checkDeliverable = await Deliverable.findOne({ where: { id, project_id } })
    if (checkDeliverable === null) {
        res.status(400).send({ "message": "Deliverable does not exist" })
    }
    else {
        if (title !== null && title.length < 20) {
            checkDeliverable.title = title
        }
        if (description !== null && description.length < 200) {
            checkDeliverable.description = description
        }
        if (link !== null) {
            checkDeliverable.link = link
        }

        await checkDeliverable.save()
        res.status(200).send({ "message": "Changes were made successfully" })
    }
})

module.exports = router
