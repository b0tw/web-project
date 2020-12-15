const jwt = require('jsonwebtoken');
const settings = require('../entities/settings');
const apiError = require('../entities/api-error');

const middleware = (req, res, next) =>
{
    const rawHeader = req.headers.authorization;
    const token = rawHeader && rawHeader.split(' ')[1];

    if(token == null)
    {
        return res.status(401).json(apiError.Unauthorized);
    }

    jwt.verify(token, settings.accessTokenSecret, (err, user) =>
    {
        if(err)
        {
            return res.status(401).json(apiError.Unauthorized);
        }

        req.user = user;
        next();
    });
};

module.exports = () => middleware;