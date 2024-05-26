var express = require('express');
var router = express.Router();

var usersRouter = require('./users');
var speciesRouter = require('./species');

router.use('/users', usersRouter); // /api/users
router.use('/species', speciesRouter); // /api/plants

router.get('/', (req, res) => {
    res.send('Welcome to the API');
});

module.exports = router;