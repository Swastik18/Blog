const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const users = require('../controllers/users')
const catchAysnc = require('../utils/catchAysnc');

router.get('/register', users.renderRegister);

router.post('/register', catchAysnc(users.register));

router.get('/login', users.renderLogin);

//passport.authenticate will compare the incoming password from user and the hashed password that is store in DB
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login);


router.get('/logout', users.logout);

module.exports = router;