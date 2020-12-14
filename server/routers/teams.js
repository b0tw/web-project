const express = require('express')
const router = express.Router();
const context = require('../entities/database/context')
const Team = context.Team
const User = context.User
const apiError = require('../entities/api-error')

router.get('/', async (req, res) => {

    // get the team id
    let name = req.params.name

    if (name === null) {
        try {
            const allTeams = await Team.findAll()
            res.status(200).send({ allTeams })
        }
        catch (err) {
            res.status(400).send({ "message": "Something bad happened" })
        }
    }
    else {
        const team = await Team.findOne({
            where: {
                name
            }
        })
        if (team === null) {
            res.status(400).send({ "message": "Team not found" })
        }
        else {
            res.status(200).send({ team })
        }
    }
})

router.post('/add', async (req, res) => {
    const name = req.body.name
    //get the username from the session
    const username = req.username

    //search in the db the user
    const user = await User.findOne({ where: username })
    //if the user is a professor, the addition can happen
    if (user.is_professor === true) {
        const existantTeam = await Team.findOne({ where: { name } })
        if (existantTeam !== null) {
            res.status(400).send({ "message": "The team name is already taken" })
        }
        else {
            try {
                const team = await Team.create({ name })
                res.status(200).send({ "message": "Team " + team.name + " was created." })
            }
            catch (err) {
                res.status(400).send({ "message": "something bad happened" })
            }
        }
    }
    else {
        res.status(400).send({ "message": apiError.Unauthorized })
    }

})

router.delete('/delete', async (req, res) => {
    //get the username from the session
    const username = req.username

    //search in the db the user
    const user = await User.findOne({ where: username })

    //if the user is a professor, the deletion can happen
    if (user.is_professor === true) {
        const name = req.body.name
        try {
            const team = await Team.findOne({ where: { name } })
            await team.destroy()
            res.status(200).send({ "message": "Team was deleted" })
        }
        catch (err) {
            res.status(400).send({ "message": "Something happened at deletion" })
        }
    }
    else {
        res.status(400).send({ "message": apiError.Unauthorized })
    }
})

module.exports = router