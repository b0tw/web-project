const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const security = require('../entities/settings').security;
const context = require('../entities/database/context');
const apiError = require('../entities/api-error');
const authenticationMiddleware = require('../middleware/authentication-middleware');

router.post('/login', async (req, res, next) =>
{
  let username = req.body.username,
    password = req.body.password;

  try
  {
    let user = await context.User.findOne({ where: { username: username }, include: [context.Session] });
    if(user == null)
    {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    let hash = await bcrypt.compare(password, user.password);
    if(hash == null || !hash)
    {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    let token = jwt.sign(username, security.tokenSecret);
    let session = await context.Session.create({
      token: token,
      user_id: user.id
    });

    return res.status(200).json({ token: token });
  }
  catch(err)
  {
    next(err);
  }
});

router.use(authenticationMiddleware());

router.head('/check-session', async (req, res, next) =>
{
  let username = req.username;

  try
  {
    let user = await context.User.findOne({ where: { username: username }, include: context.Session });
    if(user == null)
    {
      return res.status(401).json(apiError.Unauthorized);
    }

    return res.sendStatus(204);
  }
  catch(err)
  {
    next(err);
  }
});

router.get('/logout', async (req, res, next) =>
{
  
  let username = req.username,
    token = req.token;

  try
  {
    let user = await context.User.findOne({ where: { username: username }, include: context.Session });
    if(user == null)
    {
      return res.status(401).json(apiError.Unauthorized);
    }

    let session = user.Sessions.filter(s => s.token == token)[0];
    if(session == null)
    {
      return res.status(401).json(apiError.Unauthorized);
    }

    await session.destroy();

    return res.sendStatus(204);
  }
  catch(err)
  {
    next(err);
  }
});

module.exports = router;
