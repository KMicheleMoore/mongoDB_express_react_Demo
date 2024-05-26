var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/users');
const cookie = require('cookie');

// Get users
router.get('/', (req, res) => {
    res.send('respond with a resource');
});

// Register new user
router.post('/register', (req, res) => {
    // Get new user info and check for an existing user
    const userInfo = req.body;
    User.findOne({ email: userInfo.email })
        .exec()
        .then(user => {
            // If an existing user, send 409
            if (user) {
                res.status(409).send('Email already registered.');
            } else {
                // Use bcrypt.hash to store the password
                bcrypt.hash(userInfo.password, 10)
                    .then(hash => {
                        userInfo.password = hash;
                        // Create and save the new user
                        const newUser = new User(userInfo);
                        newUser.save()
                            .then(response => {
                                res.status(201).send("Successfully resistered user.");
                            })
                            .catch(saveError => {
                                console.error(saveError);
                                res.status(500).send('Unable to register new user.');
                            });
                    })
                    .catch(hashError => {
                        console.error(hashError);
                        res.status(500).send('Error hashing the password.');
                    });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Server error.');
        });
});

// Login user
router.post('/login', (req, res) => {

    const { email, password } = req.body;
    console.log(email)
    User.findOne({ email: email })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).send('Authentication failed.');
            } else {
                // Compare submitted password to corresponding hash
                bcrypt.compare(password, user.password, (err, match) => {
                    if (err) {
                        res.status(500).send('Error validating password.');
                    } else if (!match) {
                        res.status(401).send('Authentication failed.');
                    } else {
                        const token = jwt.sign({ id: user.id }, process.env.SECRET);

                        // ---ADD TOKEN TO HTTPONLY COOKIE---
                        const cookieOptions = {
                            httpOnly: true,
                            secure: true,
                            path: '/'
                        };
                        
                        // Set the cookie in the response header
                        const cookieString = cookie.serialize('jwt', token, cookieOptions);
                        res.setHeader('Set-Cookie', cookieString);
                        res.status(200).send('Authentication successful.');
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Server Error"
            });
        });
});

// Logout user
router.get('/logout', (req, res) => {
    res.clearCookie('jwt').status(204).send();
});

module.exports = router;
