const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_jwt_secret_key';

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token is required');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).send('Invalid token');
    req.user = user;
    next();
  });
};
