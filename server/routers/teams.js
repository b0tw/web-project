const express = require('express')
const router = express.Router();
<<<<<<< HEAD
<<<<<<< HEAD
const Team = require('../entities/database/context').Team

router.get('/get', async (req, res) => {

    // get the team id
    let name = req.body.name
    const team = await Team.findOne({
        where: {
            name
        }
    })
    if (team === null) {
        res.status(400).send({ message: "Team not found" })
    }
    else {
        res.status(200).send({ team })
    }

})

router.post('/add', async (req, res) => {
    const name = req.body.name

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
})

router.delete('/delete', async (req, res) => {
    const name = req.body.name
    try {
        const team = await Team.findOne({ where: { name } })
        await team.destroy()
        res.status(200).send({ "message": "Team was deleted" })
    }
    catch (err) {
        res.status(400).send({ "message": "Something happened at deletion" })
    }

=======
=======
>>>>>>> Added the structure for the route

router.get('/get',(req,res)=>{
    res.status(400)
})

router.post('/add',(req,res)=>{
    res.status(400)
})

router.put('/update',(req,res)=>{
    res.status(400)
<<<<<<< HEAD
>>>>>>> Added the structure for the route
=======
>>>>>>> Added the structure for the route
})

module.exports = router