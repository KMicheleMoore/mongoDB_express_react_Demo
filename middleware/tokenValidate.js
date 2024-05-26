var jwt = require('jsonwebtoken');

const tokenValidate = (req, res, next) => {
  try {
    if (req.cookies.jwt) {

      const jwtCookie = req.cookies.jwt;

      jwt.verify(jwtCookie, process.env.SECRET, (err, cookieInfo) => {
        if (err){
          res.status(401).send('Access is denied.')
        } else {
          next();
        }
      })
    }
  } catch (error) {
    res.status(500).send('Server Error');
}
}

module.exports = tokenValidate;