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
  const allTeams = await Team.findAll()
  return res.status(200).send(allTeams)
});

router.get('/:id', async (req, res) => {

  // get the team id
  let id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send(apiError.InvalidRequest);
  }

  let team = await context.Team.findOne({ where: { id: id }, include: [{ model: context.User, attributes: ['id', 'surname', 'name'] }, { model: context.Deliverable }] });
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
  if (user && user.is_professor == 1) {
    const existantTeam = await Team.findOne({
      where: {
        [Op.or]: [name, project_name]
      }
    })
    if (existantTeam !== null) {
      return res.status(400).send({ "message": "The team name or the project is already taken" })
    }
    else {
      const team = await Team.create({ name, project_name })
      return res.status(200).send({ "message": "Team " + team.name + " was created." })
    }
  }
  else {
    return res.status(401).send(apiError.Unauthorized);
  }

});

router.delete('/:id', async (req, res) => {
  //get the username from the session
  const username = req.username

  //search in the db the user
  const user = await User.findOne({ where: username })

  //if the user is a professor, the deletion can happen
  if (user && user.is_professor == 1) {
    const id = req.params.id
    const team = await Team.findOne({ where: { id }, include: [context.User, context.Deliverables, context.Jury ] })

    team.removeProjects(team.Projects);
    team.removeUsers(team.Users);
    team.removeDeliverables(team.Deliverables);
    team.removeDeliverables(team.Jury);
    await team.destroy();

    return res.status(200).send({ "message": "Team was deleted" })
  }
  else {
    return res.status(401).send(apiError.Unauthorized);
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

router.post('/:id/deliverables', async (req, res) => {
    let id = parseInt(req.params.id),
      title = req.body.title,
      description = req.body.description,
      url = req.body.url,
      team_id = req.body.team_id;

    //validating the received data
    if (isNaN(id) || title === null || title.length > 20
      || description == null || description.length > 200
      || url === null) {
        return res.status(400).send(apiError.InvalidRequest);
    }

    const team = await context.Team.findOne({ where: { id: team_id } })
    if (team == null) {
        return res.status(400).send(apiError.InvalidRequest)
    }
    const del = await context.Deliverable.create({ title, description, url, team_id })

    team.Deliverables.push(del);
    team.setDeliverables(team.Deliverables);
    await team.save()

    return res.status(200).send({ "message": del.title + " was created." })
});

router.put('/:id/deliverables/:deliverableId', async (req, res) => {
    let id = parseInt(req.params.id),
      deliverableId = parseInt(req.params.deliverableId),
      title = req.body.title,
      description = req.body.description,
      link = req.body.link;

    let deliverable = await context.Deliverable.findOne({ where: { id: deliverableId, team_id: id } })
    if (deliverable == null) {
        return res.status(400).send(apiError.InvalidRequest);
    }

    if (title !== null && title.length < 20) {
        deliverable.title = title
    }
    if (description !== null && description.length < 200) {
        deliverable.description = description
    }
    if (link !== null) {
        deliverable.link = link
    }

    await deliverable.save()
    return res.status(200).send({ "message": "Changes were made successfully" })
});

router.delete('/:id/deliverables', async (req, res) => {
    let id = parseInt(req.params.id),
      deliverables = req.body; 

    //validating the received data
    if (isNaN(id) || typeof deliverables != 'object' || deliverables.some(d => typeof d.id == 'number')) {
        return res.status(400).send(apiError.InvalidRequest);
    }

    const team = await context.Team.findOne({ where: { id: id } })
    if (team == null) {
        return res.status(400).send(apiError.InvalidRequest)
    }
    
    const newDeliverables = [];
    team.Deliverables.forEach(d =>
    {
      if(!deliverables.some(nd => nd.id == d.id))
      {
        newDeliverables.push(d);
      }
    });

    team.setDeliverables(newDeliverables);
    await team.save()

    return res.status(200).send({ "message": "Team deliverables updated successfully." })
});

module.exports = router
