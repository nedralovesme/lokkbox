'use strict';
const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('home', {session: req.session});
});

router.get('/login', (req, res) => {
    res.render('login', {session: req.session});
});

router.get('/join', (req, res) => {
    res.render('register', {session: req.session});
});

// router.get('/user/register', (req, res) => {
//     // if (req.session.token) {
//     //     res.redirect('/user/account');
//     // } else {
//         res.render('register')};

module.exports = router;
