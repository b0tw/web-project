const middleware = (err, req, res, next) =>
{
  console.log(err)
  if(res && res.headersSent)
  {
    return next(err);
  }

  return res.status(500).json({ message: err.toString() });
};

module.exports = () => middleware;
