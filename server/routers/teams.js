const express = require('express')
const router = express.Router();
const context = require('../entities/database/context')
const Team = context.Team
const User = context.User
const apiError = require('../entities/api-error')
const authentication = require('../middleware/authentication-middleware');
const { Op } = require("sequelize");

router.use(authentication());

router.get('/', async (req, res, next) => {
  // get the all teams
  try
  {
    const allTeams = await Team.findAll({ include: [ { model: context.Jury, include: [ context.User ] } ] })

    let result = allTeams.map(t => t.get({ plain: true }));
    result.forEach(t => {
      if(t.Jury && t.Jury.Users)
      {
        const grades = t.Jury.Users.map(u => u.UserJury.grade);
        t.grade = (grades.reduce((sum, g) => sum + g, 0) / grades.length).toFixed(2);
        t.Jury = null;
      }
    });

    if(req.query.sort && req.query.sort === 'true')
    {
      result = result.sort((a, b) => a.grade < b.grade ? 1 : ( a.grade > b.grade ? -1 : 0 ));
      if(result.length > 5)
      {
        result = result.splice(0, 5);
      }
    }

    return res.status(200).send(result);
  }
  catch(err)
  {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {

  // get the team id
  let id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send(apiError.InvalidRequest);
  }

  try
  {
    let team = await context.Team.findOne({ where: { id: id }, include: [
      { model: context.User, attributes: ['id', 'username','surname', 'name'] },
      { model: context.Deliverable },
      { 
        model: context.Jury, include: [
          { model: context.User }
        ]
      }
    ]});
    if (team == null) {
      return res.status(400).send(apiError.InvalidRequest);
    }

    let result = team.get({ plain: true });
    if(result.Jury && result.Jury.Users)
    {
      result.Jury.grades = result.Jury.Users.map(u => ({ value: u.UserJury.grade, deadline: u.UserJury.deadline, userId: u.id }));
      result.Jury.Users = null;
    }

    return res.status(200).json(result);
  }
  catch(err)
  {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const name = req.body.name
  const project_name = req.body.project_name

  try
  {
    //get the username from the session
    const username = req.username
    //search in the db the user
    const user = await User.findOne({ where: { username: username } });
    //if the user is a professor, the addition can happen
    if (user && user.is_professor == 1) {
      const existantTeam = await Team.findOne({
        where: {
          [Op.or]: [{ name: name }, { project_name: project_name} ]
        }
      })
      if (existantTeam !== null) {
        return res.status(400).send({ "message": "The team name or the project is already taken" })
      }
      else {
        const team = await Team.create({ name: name, project_name: project_name })
        let jury = await context.Jury.create({});
        team.setJury(jury);
        await team.save();
        return res.status(200).send({ "message": "Team " + team.name + " was created." })
      }
    }
    else {
      return res.status(401).send(apiError.Unauthorized);
    }
  }
  catch(err)
  {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  //get the username from the session
  const username = req.username

  try
  {
    //search in the db the user
    const user = await User.findOne({ where: {username:username} })

    //if the user is a professor, the deletion can happen
    if (user && user.is_professor == 1) {
      const id = req.params.id
      const team = await Team.findOne({ where: { id:id }, include: [context.User, context.Deliverable, context.Jury ] })

      team.removeUsers(team.Users);
      team.removeDeliverables(team.Deliverables);
      team.removeDeliverables(team.Jury);
      await team.destroy();

      return res.status(200).send({ "message": "Team was deleted" })
    }
    else {
      return res.status(401).send(apiError.Unauthorized);
    }
  }
  catch(err)
  {
    next(err);
  }
});

router.post('/:id/members', async (req, res, next) => {
  let id = parseInt(req.params.id),
    members = req.body;

  if (isNaN(id)) {
    return res.status(401).json(apiError.Unauthorized);
  }

  try
  {
    let user = await context.User.findOne({ where: [ { username: req.username } ] });
    if(!user && user.is_professor != 1)
    {
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
  }
  catch(err)
  {
    next(err);
  }
});

router.delete('/:id/members', async (req, res, next) => {
  let id = parseInt(req.params.id),
    members = req.body;

  if (isNaN(id)) {
    return res.status(401).json(apiError.Unauthorized);
  }

  try
  {
    let user = await context.User.findOne({ where: [ { username: req.username } ] });
    if(!user && user.is_professor != 1)
    {
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
  }
  catch(err)
  {
    next(err);
  }
});

router.post('/:id/deliverables', async (req, res, next) => {
  let id = parseInt(req.params.id),
    title = req.body.title,
    description = req.body.description,
    url = req.body.url;
  //validating the received data
  if (isNaN(id) || title === null || title.length < 10
    || description == null || description.length < 10
    || url === null) {
      return res.status(400).send(apiError.InvalidRequest);
  }

  try
  {
    let user = await context.User.findOne({ where: [ { username: req.username } ] });
    if(!user)
    {
      return res.status(401).json(apiError.Unauthorized);
    }

    const team = await context.Team.findOne({ where: { id: id }, include:[context.User, context.Deliverable] })
    if (team == null) {
        return res.status(400).send(apiError.InvalidRequest)
    }
    if(team.Users.find(u => u.id == user.id) == null)
    {
      return res.status(401).json(apiError.Unauthorized);
    }

    const del = await context.Deliverable.create({ title: title, description: description, url: url, team_id: id })

    team.Deliverables.push(del);
    team.setDeliverables(team.Deliverables);
    await team.save()

    return res.status(200).send({ "message": del.title + " was created." })
  }
  catch(err)
  {
    next(err);
  }
});

router.put('/:id/deliverables/:deliverableId', async (req, res, next) => {
  let id = parseInt(req.params.id),
    deliverableId = parseInt(req.params.deliverableId),
    title = req.body.title,
    description = req.body.description,
    link = req.body.link;

  try
  {
    let user = await context.User.findOne({ where: [ { username: req.username } ] });
    if(!user)
    {
      return res.status(401).json(apiError.Unauthorized);
    }

    const team = await context.Team.findOne({ where: { id: id }, include: [ context.User ] })
    if (team == null) {
        return res.status(400).send(apiError.InvalidRequest)
    }
    if(team.Users.find(u => u.id == user.id) == null)
    {
      return res.status(401).json(apiError.Unauthorized);
    }

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
  }
  catch(err)
  {
    next(err);
  }
});

router.delete('/:id/deliverables', async (req, res, next) => {
  let id = parseInt(req.params.id),
    deliverables = req.body; 

  try
  {
    let user = await context.User.findOne({ where: [ { username: req.username } ] });
    if(!user)
    {
      return res.status(401).json(apiError.Unauthorized);
    }

    //validating the received data
    if (isNaN(id) || typeof deliverables != 'object' || !deliverables.some(d => typeof d.id == 'number')) {
        return res.status(400).send(apiError.InvalidRequest);
    }

    const team = await context.Team.findOne({ where: { id: id }, include: [ context.User, context.Deliverable ] })
    if (team == null) {
        return res.status(400).send(apiError.InvalidRequest)
    }
    if(team.Users.find(u => u.id == user.id) == null)
    {
      return res.status(401).json(apiError.Unauthorized);
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
  }
  catch(err)
  {
    next(err);
  }
});

router.post('/:id/juries', async (req, res, next) => {
  let id = parseInt(req.params.id),
    juries = req.body;

  try
  {
    let user = await context.User.findOne({ where: [ { username: req.username } ] });
    if(!user || user.is_professor != 1)
    {
      return res.status(401).json(apiError.Unauthorized);
    }

    //validating the received data
    if (isNaN(id) || typeof juries != 'object' || juries.some(j => typeof j.id != 'number' || j.username == null)) {
        return res.status(400).send(apiError.InvalidRequest);
    }

    const team = await context.Team.findOne({ where: { id: id }, include: [ context.Jury ] })
    if (team == null) {
        return res.status(400).send(apiError.InvalidRequest)
    }

    const users = await context.User.findAll({ where: { id: juries.map(j => j.id)  } });
    if(users == null || users.length < 1 || users.some(u => juries.filter(j => j.id == u.id && j.username == u.username).length < 1))
    {
        return res.status(400).send(apiError.InvalidRequest);
    }

    team.Jury.setUsers(users);
    await team.save()

    return res.status(200).send({ "message": "Juries added to the team." })
  }
  catch(err)
  {
    next(err);
  }
});

router.delete('/:id/juries', async (req, res, next) => {
  let id = parseInt(req.params.id),
    juries = req.body; 

  try
  {
    let user = await context.User.findOne({ where: [ { username: req.username } ] });
    if(!user || user.is_professor != 1)
    {
      return res.status(401).json(apiError.Unauthorized);
    }

    //validating the received data
    if (isNaN(id) || typeof juries != 'object' || juries.some(j => typeof j.id != 'number' || j.username == null)) {
        return res.status(400).send(apiError.InvalidRequest);
    }

    const team = await context.Team.findOne({ where: { id: id }, include: [ { model: context.Jury, include: [ context.User ] } ] })
    if (team == null) {
        return res.status(400).send(apiError.InvalidRequest)
    }
    
    const newJuries = [];
    team.Jury.Users.forEach(u =>
    {
      if(!juries.some(j => j.id == u.id))
      {
        newJuries.push(u);
      }
    });

    team.Jury.setUsers(newJuries);
    await team.save()

    return res.status(200).send({ "message": "Team juries updated successfully." })
  }
  catch(err)
  {
    next(err);
  }
});

router.post('/:id/grade', async (req, res, next) =>
{
  let id = parseInt(req.params.id),
    username = req.username,
    grade = parseFloat(req.body.grade);

  try
  {
    if(isNaN(id) || username == null || isNaN(grade))
    {
      return res.status(400).json(apiError.InvalidRequest);
    }

    const team = await context.Team.findOne({ where: { id: id }, include: [ { model: context.Jury, include: [ context.User ] } ] })
    if(team == null) {
        return res.status(400).send(apiError.InvalidRequest)
    }

    const user = await context.User.findOne({ where: { username: username } });
    if(user == null)
    {
        return res.status(400).send(apiError.InvalidRequest);
    }

    if(team.Jury.Users.find(u => u.id == user.id) == null)
    {
      return res.status(401).json(apiError.Unauthorized);
    }

    let userJury = team.Jury.Users.find(u => u.id == user.id).UserJury;
    if(userJury)
    {
      if(userJury.deadline < new Date())
      {
        return res.status(401).json(apiError.Unauthorized);
      }

      userJury.grade = grade;
      await userJury.save();
    }
    else
    {
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await context.UserJury.create({ grade: grade, deadline: tomorrow, user_id: user.id, jury_id: team.Jury.id });
    }

    return res.status(200).json({ message: "Successfully updated team grade." });
  }
  catch(err)
  {
    next(err);
  }
});

module.exports = router
