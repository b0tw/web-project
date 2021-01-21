const router = require('express').Router();
const bcrypt = require('bcrypt');
const security = require('../entities/settings').security;
const authentication = require('../middleware/authentication-middleware');
const context = require('../entities/database/context')
const apiError = require('../entities/api-error');
const Op = require('sequelize').Op;

router.post('/', async (req, res, next) => {
  let username = req.body.username,
    surname = req.body.surname,
    name = req.body.name,
    password = req.body.password,
    is_professor = req.body.is_professor;

  try {
    if (username == null || username.match(/^[ ]*$/g)
      || surname == null || surname.match(/^[ ]*$/g)
      || name == null || name.match(/^[ ]*$/g)
      || password == null || password.match(/^[ ]*$/g)
      || is_professor == null || (is_professor !== 0 && is_professor !== 1)) {
      return res.status(400).json(apiError.InvalidRequest);
    }

    let passwdHash = await bcrypt.hash(password, security.saltRounds);
    if (passwdHash == null) {
      return res.status(500).json(apiError.InternalError);
    }

    let user = await context.User.create({
      username: username,
      surname: surname,
      name: name,
      password: passwdHash,
      is_professor: is_professor
    });
    if (user == null) {
      return res.status(500).json(apiError.InternalError);
    }
    return res.status(200).json({ message: 'User created succesfully.' });
  }
  catch (err) {
    next(err);
  }
});

router.use(authentication());

router.get('/', async (req, res, next) => {
  let surname = req.query.surname,
    name = req.query.name,
    username = req.query.username,
    is_professor = parseInt(req.query.is_professor);

  let filters = [];
  if(surname != null)
  {
    filters.push({ surname: { [Op.like]: `%${surname}%` } });
  }
  if(name != null)
  {
    filters.push({ name: { [Op.like]: `%${name}%` } });
  }
  if(username != null)
  {
    filters.push({ username: { [Op.eq]: `${username}` } });
  }
  if (is_professor === 0 || is_professor === 1) {
    filters.push({ is_professor: is_professor })
  }

  let options = {
    attributes: ['id', 'username', 'surname', 'name', 'is_professor']
  };
  if (filters.length > 0) {
    options['where'] = {
      [Op.or]: filters
    };
  }

  try {
    let users = await context.User.findAll(options);
    return res.status(200).json(users);
  }
  catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) =>
{
  let id = parseInt(req.params.id);

    if(isNaN(id))
    {
      return res.status(400).json(apiError.InvalidRequest);
    }

  try
  {
    let user = await context.User.findOne({
      where: { id: id },
      include: [ { model: context.Jury, include: [ context.Team ] }, 
        { model: context.Team } ]
    });
    user.password = null;
    return res.status(200).json(user);
  }
  catch(err)
  {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  let id = parseInt(req.params.id),
    username = req.body.username,
    surname = req.body.surname,
    name = req.body.name,
    password = req.body.password;

  try {
    if (isNaN(id)
      || username == null || username.match(/^[ ]*$/g)
      || surname == null || surname.match(/^[ ]*$/g)
      || name == null || name.match(/^[ ]*$/g))
    {
      return res.status(400).json(apiError.InvalidRequest);
    }

    let currentUser = await context.User.findOne({ where: { username: req.username } });
    let user = await context.User.findOne({ where: { id: id } });
    if (currentUser == null || user == null) {
      return res.status(400).json(apiError.InvalidRequest);
    }

    if (currentUser.id != user.id && currentUser.is_professor == 0) {
      return res.status(401).json(apiError.Unauthorized);
    }

    let passwdHash = null;
    if (password != null) {
      passwdHash = await bcrypt.hash(password, security.saltRounds);
      if (passwdHash == null) {
        return res.status(500).json(apiError.InternalError);
      }
    }

    user.username = username;
    user.surname = surname;
    user.name = name;
    if (passwdHash != null) {
      user.password = passwdHash;
    }
    await user.save();

    return res.status(200).json({ message: 'User data updated.' });
  }
  catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  let id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json(apiError.InvalidRequest);
  }

  try {
    let currentUser = await context.User.findOne({ where: { username: req.username } });
    let user = await context.User.findOne({ where: { id: id }, include: [context.Team, context.Session] });
    if (currentUser == null || user == null) {
      return res.status(400).json(apiError.InvalidRequest);
    }

    if (currentUser.id != user.id && currentUser.is_professor == 0) {
      return res.status(401).json(apiError.Unauthorized);
    }

    if (user.Team && user.Team.length > 0) {
      user.removeTeams(user.Team);
    }

    if (user.Session && user.Session.length > 0) {
      user.removeSessions(user.Session);
    }

    await user.save()
    await user.destroy();

    return res.sendStatus(204);
  }
  catch (err) {
    next(err);
  }
});

module.exports = router
