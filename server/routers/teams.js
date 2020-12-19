const express = require('express')
const router = express.Router();
const context = require('../entities/database/context')
const Team = context.Team
const User = context.User
const apiError = require('../entities/api-error')
const authentication = require('../middleware/authentication-middleware');
const { Op } = require("sequelize");

router.use(authentication());

router.get('/', async (req, res) => {

  // get the all teams
  try {
    const allTeams = await Team.findAll()
    return res.status(200).send(allTeams)
  }
  catch (err) {
    return res.status(400).send({ "message": "Something bad happened" })
  }

});

router.get('/:id', async (req, res) => {

  // get the team id
  let id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send(apiError.InvalidRequest);
  }

  let team = await context.Team.findOne({ where: { id: id }, include: [{ model: context.User, attributes: ['id', 'surname', 'name'] }] });
  if (team == null) {
    return res.status(400).send(apiError.InvalidRequest);
  }

  return res.status(200).json(team);
});

router.post('/', async (req, res) => {
  const name = req.body.name
  const project_name = req.body.project_name

  //get the username from the session
  const username = req.username

  //search in the db the user
  const user = await User.findOne({ where: username })
  //if the user is a professor, the addition can happen
  if (user.is_professor === true) {
    const existantTeam = await Team.findOne({
      where: {
        [Op.or]: [name, project_name]
      }
    })
    if (existantTeam !== null) {
      return res.status(400).send({ "message": "The team name or the project is already taken" })
    }
    else {
      try {
        const team = await Team.create({ name, project_name })
        return res.status(200).send({ "message": "Team " + team.name + " was created." })
      }
      catch (err) {
        return res.status(400).send({ "message": "something bad happened" })
      }
    }
  }
  else {
    return res.status(400).send({ "message": apiError.Unauthorized })
  }

});

router.delete('/:id', async (req, res) => {
  //get the username from the session
  const username = req.username

  //search in the db the user
  const user = await User.findOne({ where: username })

  //if the user is a professor, the deletion can happen
  if (user.is_professor === true) {
    const id = req.params.id
    try {
      const team = await Team.findOne({ where: { id }, include: [context.User, context.Project] })
      team.removeProjects(team.Projects);
      team.removeUsers(team.Users);
      await team.destroy()
      return res.status(200).send({ "message": "Team was deleted" })
    }
    catch (err) {
      return res.status(400).send({ "message": "Something happened at deletion" })
    }
  }
  else {
    return res.status(400).send({ "message": apiError.Unauthorized })
  }
});

router.post('/:id/members', async (req, res) => {
  let id = parseInt(req.params.id),
    members = req.body;

  if (isNaN(id)) {
    return res.status(401).json(apiError.Unauthorized);
  }

  if (members.some(m => m.id == null || m.username == null || m.username.match(/^[ ]*$/g))) {
    return res.status(400).json(apiError.InvalidRequest);
  }

  let team = await context.Team.findOne({ where: { id: id }, include: [context.User] });
  if (team == null) {
    return res.status(400).json(apiError.InvalidRequest);
  }

  let users = await context.User.findAll({ where: { id: members.map(m => m.id) }, include: [context.Team] });

  users.forEach(async (u, i) => {
    if (members[i].username == u.username) {
      u.Teams.push(team);
      u.setTeams(u.Teams);
      await u.save();
    }
  });

  return res.status(200).json({ message: 'Team members updated successfully.' });
});

router.delete('/:id/members', async (req, res) => {
  let id = parseInt(req.params.id),
    members = req.body;

  if (isNaN(id)) {
    return res.status(401).json(apiError.Unauthorized);
  }

  if (members.some(m => m.id == null || m.username == null || m.username.match(/^[ ]*$/g))) {
    return res.status(400).json(apiError.InvalidRequest);
  }

  let team = await context.Team.findOne({ where: { id: id }, include: [context.User] });
  if (team == null) {
    return res.status(400).json(apiError.InvalidRequest);
  }

  let newMembers = [];
  team.Users.forEach(u => {
    if (!members.some(m => m.id == u.id && m.username == u.username)) {
      newMembers.push(u);
    }
  });
  team.setUsers(newMembers);
  await team.save();

  return res.status(200).json({ message: 'Team members updated successfully.' });
});

module.exports = router
