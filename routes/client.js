'use strict';
const router = require('express').Router();
const multer = require('multer');

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

router.get('/dashboard', (req, res) => {
    res.render('dashboard', {session: req.session});
});

router.get('/userCollections', (req, res) => {
    res.render('userCollections', {session: req.session});
});

router.get('/fileuploader', (req, res) => {
    res.render('fileuploader', {session: req.session});
});



// router.get('/user/register', (req, res) => {
//     // if (req.session.token) {
//     //     res.redirect('/user/account');
//     // } else {
//         res.render('register')};

// ***********************************
// VIDEO CONVERTER (TO .MP4)
router.post('/save_file', multer({
   dest: './uploads/'
}).single('upl'), function(req, res) {

   // req.app.io.on('connection', function(socket) {
       req.app.io.emit('files', "this is a test");
       // req.app.io.on('my other event', function(data) {
       //     console.log(data);
       // });
   // });
   // console.log(req.body); //form fields
   /* example output:
   { title: 'abc' }
    */
   // console.log(req.file); //form files
   /* example output:
           { fieldname: 'upl',
             originalname: 'grumpy.png',
             encoding: '7bit',
             mimetype: 'image/png',
             destination: './uploads/',
             filename: '436ec561793aa4dc475a88e84776b1b9',
             path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
             size: 277056 }
     */
   var spawn = require('child_process').spawn;
   var child = spawn(
       '/Applications/ffmpeg', [
           '-i', req.file.path,
           '-f', 'mp4',
           '-vcodec', 'libx264',
           '-preset', 'fast',
           '-profile:v', 'main',
           '-acodec', 'aac',
           '-strict', '-2',
           req.file.path + '.mp4', '-hide_banner'
       ]
       //,function(){console.log("finished");}
   );
   console.log("spawning child process");
   //ffmpeg -i input.ext -f mp4 -vcodec libx264 -preset fast -profile:v main -acodec aac -strict -2 input.ext.mp4 -hide_banner

   /*
   child.stdout.on('data', function(data) {
     // output will be here in chunks
     console.log(data);
   });
   */

   /*
   // Listen for any errors:
   child.stderr.on('data', function (data) {
       //console.log('There was an error: ' + data);
   });
   */

   child.on('exit', function() {
       console.log('finished the child process');
       req.app.io.emit('files', "finished the child process");
   })

   // or if you want to send output elsewhere
   //child.stdout.pipe(dest);
   res.status(204).end();
});





module.exports = router;
