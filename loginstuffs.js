const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const session = require('client-sessions');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:rocket@localhost:5432/test';
const app = express();
var bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static("public"));
app.use(session({
    cookieName: 'session',
    secret: 'wooooooooo'
}));
app.set('view engine', 'hbs');

var client = new pg.Client(connectionString);
client.connect();

app.get('/', function(req, res) {
    res.render('index.hbs')
});

})

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
})

app.get('/loginPage', function(req, res){
    res.render('login.hbs')
})

app.get('/success', function(req, res){
    res.render('success.hbs')
})

app.post('/login', function(req, res) {
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



app.post('/signout', function(req, res){
    req.session.reset();
    console.log(req.session.name);
    res.redirect('/')
})

app.listen(3000, function() {
    console.log('Working');
});
