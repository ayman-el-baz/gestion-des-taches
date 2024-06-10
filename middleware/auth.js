const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  if (!token) {
    return res.status(403).send("Un token est requis pour l'authentification");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Token invalide");
  }
  return next();
};

module.exports = auth;
