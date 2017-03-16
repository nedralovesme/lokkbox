'use strict';
const router = require('express').Router();
const pg = require('pg');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('client-sessions');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:rocket@localhost:5432/test';

var bcrypt = require('bcrypt');
const saltRounds = 10;

router.use(session({
    cookieName: 'session',
    secret: 'wooooooooo'
}));

var client = new pg.Client(connectionString);
client.connect();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded());

function auth (req, res, next){
    if (req.session.name) {
        next();
    } else {
        res.redirect('/join')
        console.log('Log in asshole');
    }
}


router.get('/', (req, res) => {
    res.render('home', {session: req.session});
});

router.get('/login', (req, res) => {
    res.render('login', {session: req.session});
});

router.get('/join', (req, res) => {
    res.render('register', {session: req.session});
});

router.get('/demo', (req, res) => {
    res.render('register', {session: req.session});
});

router.get('/dashboard', auth, (req, res) => {
    res.render('dashboard', {session: req.session});
});

router.get('/userCollections', (req, res) => {
    res.render('userCollections', {session: req.session});
});

router.get('/fileuploader', (req, res) => {
    res.render('fileuploader', {session: req.session});
});


router.post('/submit_new_user', function(req, res) {
    console.log(req.body);
    var f_name = req.body.f_name;
    var l_name = req.body.l_name;
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var dob = req.body.month + "/" + req.body.day + "/" + req.body.year;
    var c_date = new Date();

    bcrypt.genSalt(saltRounds, function(err, salt){
        bcrypt.hash(password, salt, function(err, hash){
            client.query("INSERT INTO users(f_name, l_name, username, email, password, birthday, c_date) VALUES ('" + f_name + "', '" + l_name + "', '" + username + "', '" + email + "', '" + hash + "', '" + dob + "', '" + c_date + "')", function(err, results) {
                if (err){
                    throw err;
                }
            });
        });
    });
    console.log("user has registered");
    res.redirect('/')
});

router.post('/submit_login', function(req, res) {
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
                res.redirect('/dashboard')
            } else{
                console.log("WRONG PASSWORD");
                res.redirect('/')
            }
        });
    });
});

router.get('/logout', function(req, res){
    req.session.reset();
    console.log(req.session.name);
    res.redirect('/')
})


// router.get('/user/register', (req, res) => {
//     // if (req.session.token) {
//     //     res.redirect('/user/account');
//     // } else {
//         res.render('register')};

var storage =   multer.diskStorage({
  // destination: function (req, file, callback) {
  //   fs.mkdir('./uploads', function(err) {
  //       if(err) {
  //           console.log(err.stack)
  //       } else {
  //           callback(null, './uploads');
  //       }
  //   })
  // },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

router.post('/api/save_pic',function(req,res){
    var upload = multer({ dest : '/Users/patrickbullion/htdocs/lokkbox/uploads'});
    multer(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

// router.post('/save_pic', function(req, res){
// 	var obj = {};
// 	console.log('body: ' + JSON.stringify(req.body));
// 	res.send(req.body);
// });
// ***********************************
// VIDEO CONVERTER (TO .MP4)
// router.post('/save_video', multer({
//    dest: './uploads/'
// }).single('upl'), function(req, res) {
//
//    // req.app.io.on('connection', function(socket) {
//        req.app.io.emit('files', "this is a test");
//        // req.app.io.on('my other event', function(data) {
//        //     console.log(data);
//        // });
//    // });
//    // console.log(req.body); //form fields
//    /* example output:
//    { title: 'abc' }
//     */
//    // console.log(req.file); //form files
//    /* example output:
//            { fieldname: 'upl',
//              originalname: 'grumpy.png',
//              encoding: '7bit',
//              mimetype: 'image/png',
//              destination: './uploads/',
//              filename: '436ec561793aa4dc475a88e84776b1b9',
//              path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
//              size: 277056 }
//      */
//    var spawn = require('child_process').spawn;
//    var child = spawn(
//        '/Applications/ffmpeg', [
//            '-i', req.file.path,
//            '-f', 'mp4',
//            '-vcodec', 'libx264',
//            '-preset', 'fast',
//            '-profile:v', 'main',
//            '-acodec', 'aac',
//            '-strict', '-2',
//            req.file.path + '.mp4', '-hide_banner'
//        ]
//        //,function(){console.log("finished");}
//    );
//    console.log("spawning child process");
//    //ffmpeg -i input.ext -f mp4 -vcodec libx264 -preset fast -profile:v main -acodec aac -strict -2 input.ext.mp4 -hide_banner
//
//    /*
//    child.stdout.on('data', function(data) {
//      // output will be here in chunks
//      console.log(data);
//    });
//    */
//
//    /*
//    // Listen for any errors:
//    child.stderr.on('data', function (data) {
//        //console.log('There was an error: ' + data);
//    });
//    */
//
//    child.on('exit', function() {
//        console.log('finished the child process');
//        req.app.io.emit('files', "finished the child process");
//    })
//
//    // or if you want to send output elsewhere
//    //child.stdout.pipe(dest);
//    res.status(204).end();
// });





module.exports = router;
