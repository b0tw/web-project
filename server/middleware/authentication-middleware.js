const jwt = require('jsonwebtoken');
const security = require('../entities/settings').security;
const apiError = require('../entities/api-error');
const context = require('../entities/database/context');

const middleware = (req, res, next) =>
{
  const rawHeader = req.headers.authorization;
  const token = rawHeader && rawHeader.split(' ')[1];

  if(token == null)
  {
    return res.status(401).json(apiError.Unauthorized);
  }

  return jwt.verify(token, security.tokenSecret, async (err, username) =>
  {
    if(err)
    {
      return res.status(401).json(apiError.Unauthorized);
    }

    let user = await context.User.findOne({ where: { username: username }, include: [ context.Session ] }),
      session = user.Sessions && user.Sessions.find(s => s.token == token);
    if(session == null)
    {
      return res.status(401).json(apiError.Unauthorized);
    }

    req.username = username;
    req.token = token;
    return next();
  });
};

module.exports = () => middleware;
