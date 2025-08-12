module.exports = (err, req, res, next) => {
    console.error(err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'Internal server error' });
  };
  