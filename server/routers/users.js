const router = require('express').Router();
const bcrypt = require('bcrypt');
const security = require('../entities/settings').security;
const authentication = require('../middleware/authentication-middleware');
const context = require('../entities/database/context')
const apiError = require('../entities/api-error');

router.post('/', async (req, res) =>
{
  let username = req.body.username,
    surname = req.body.surname,
    name = req.body.name,
    password = req.body.password,
    is_professor = req.body.is_professor;

  if(username == null || username.match(/^[ ]*$/g)
    || surname == null || surname.match(/^[ ]*$/g)
    || name == null || name.match(/^[ ]*$/g)
    || password == null || password.match(/^[ ]*$/g)
    || is_professor == null || (is_professor !== 0 && is_professor !== 1))
  {
    return res.status(400).json(apiError.InvalidRequest);
  }

  let passwdHash = await bcrypt.hash(password, security.saltRounds);
  if(passwdHash == null)
  {
    return res.status(500).json(apiError.InternalError);
  }

  let user = await context.User.create({
    username: username,
    surname: surname,
    name: name,
    password: passwdHash,
    is_professor: is_professor
  });
  if(user == null)
  {
    return res.status(500).json(apiError.InternalError);
  }
  return res.status(200).json({ message: 'User created succesfully.' });
});

router.use(authentication());

router.get('/', async (req, res) =>
{
  let surname = req.query.surname,
    name = req.query.name;

  let filters = [];
  if(surname != null)
  {
    filters.push({ surname: `%${surname}%` });
  }
  if(name != null)
  {
    filters.push({ name: `%${name}%` });
  }

  let options = {
    attributes: [ 'id', 'username', 'surname', 'name', 'is_professor' ]
  };
  if(filters.length > 0)
  {
    options['where'] = {
        $or: filters
    };
  }

  let users = await context.User.findAll(options);
  return res.status(200).json(users);
});

router.put('/:id', async (req, res) =>
{
  let id = parseInt(req.params.id),
    username = req.body.username,
    surname = req.body.surname,
    name = req.body.name,
    password = req.body.password;

  if(isNaN(id)
    || username == null || username.match(/^[ ]*$/g)
    || surname == null || surname.match(/^[ ]*$/g)
    || name == null || name.match(/^[ ]*$/g)
    || is_professor == null || !password.match(/^[01]*$/g))
  {
    return res.status(400).json(apiError.InvalidRequest);
  }

  let user = await context.User.findOne({ id: id });
  if(user == null)
  {
    return res.status(400).json(apiError.InvalidRequest);
  }

  let passwdHash = null;
  if(password != null)
  {
    passwdHash = await bcrypt.hash(password, security.saltRounds);
    if(passwdHash == null)
    {
      return res.status(500).json(apiError.InternalError);
    }
  }

  user.username = username;
  user.surname = surname;
  user.name = name;
  if(passwdHash != null)
  {
    user.password = passwdHash;
  }
  await user.save();

  return res.status(200).json({ message: 'User data updated.' });
});

router.delete('/:id', async (req, res) =>
{
  let id = parseInt(req.params.id);
  if(isNaN(id))
  {
    return res.status(400).json(apiError.InvalidRequest);
  }

  let user = await context.User.findOne({ id: id, include: [ context.Project, context.Team, context.Session ] });
  if(user == null)
  {
    return res.status(400).json(apiError.InvalidRequest);
  }

  if(user.Project && user.Project.length > 0)
  {
    user.removeProjects(user.Project);
  }

  if(user.Team && user.Team.length > 0)
  {
    user.removeTeams(user.Team);
  }

  if(user.Session && user.Session.length > 0)
  {
    user.removeSessions(user.Session);
  }

  await user.save()
  await user.destroy();

  return res.sendStatus(204);
});
module.exports = router
