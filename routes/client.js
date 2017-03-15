'use strict';
const router = require('express').Router();
const pg = require('pg');
const path = require('path');
const session = require('client-sessions');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/test';// replace "password" with your pg pasword 

var bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(session({
    cookieName: 'session',
    secret: 'wooooooooo'
}));

var client = new pg.Client(connectionString);
client.connect();


router.get('/', (req, res) => {
    res.render('home', {session: req.session});
});

router.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    client.query("SELECT password FROM users WHERE username ='" + username + "'", function(err, result) {
        // console.log(result.rows);
        if (err) {
            throw err;
        }
        var hash = result.rows[0].password;
        bcrypt.compare(password, hash, function(err, doesMatch){
            if (doesMatch){
                req.session.name = username;
                console.log(req.session.name);
                console.log("user has logged in");
                res.redirect('/success')
            } else{
                console.log("WRONG PASSWORD");
                res.redirect('/')
            }
        });
    });
});

router.get('/loginPage', function(req, res){
    res.render('login.hbs')
})

router.get('/join', (req, res) => {
    res.render('register', {session: req.session});
});

router.post('/signout', function(req, res){
    req.session.reset();
    console.log(req.session.name);
    res.redirect('/')
});

app.post('/signup', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    bcrypt.genSalt(saltRounds, function(err, salt){
        bcrypt.hash(password, salt, function(err, hash){
            client.query("INSERT INTO users(username, password) VALUES ('" + username + "', '" + hash + "')", function(err, results) {
                if (err){
                    throw err;
                }
            });
        });
    });

    console.log("user has registered");
    res.redirect('/')
});

// router.get('/user/register', (req, res) => {
//     // if (req.session.token) {
//     //     res.redirect('/user/account');
//     // } else {
//         res.render('register')};

module.exports = router;
