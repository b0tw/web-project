const middleware = async (err, req, res, next) =>
{
  if(res.headersSent)
  {
    return next(err);
  }

  return res.status(500).json({ message: err });
};

module.exports = () => middleware;
