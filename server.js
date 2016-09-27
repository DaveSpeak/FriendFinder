// Dependencies
// =============================================================
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
// var firebase = require("firebase");

//firebase
// var firebase = require("firebase");
// firebase.initializeApp({
//   serviceAccount: "fbKey.json",
//   databaseURL: 'https://hot-restaurant.firebaseio.com/'
// });
// var db = firebase.database();

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

//Sets up the Express app to serve static files
app.use(express.static(path.join(__dirname, 'app/')));
// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


//routes

require('./app/routing/api-routes.js')(app); 
require('./app/routing/html-routes.js')(app);


app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'app/public/home.html'));
});

app.get('/survey', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/public/survey.html'));
});

app.get('/api/friends', function(req, res) {
    console.log('Hello');
    var tables = [];
    // db.ref('tables').once("value", function(snapshot) {
    //     snapshot.forEach(function(snap) {
    //         var table = snap.val();
    //         table.id = snap.key;
    //         tables.push(table);
    //     });
    //     res.send(tables);
    // });
});

app.get('/api/waitlist', function (req, res) {
    var waitlist = [];
    // db.ref('waitlist').once("value", function(snapshot) {
    //     snapshot.forEach(function(snap) {
    //         var table = snap.val();
    //         table.id = snap.key;
    //         waitlist.push(table);
    //     })
    //     res.send(waitlist);
    // })
})

app.get('/tables', function (req, res) {
    res.sendFile(path.join(__dirname, 'app/public/tables.html'));
});

app.post('/api/new', function(req, res) {
    console.log(req.body);
    var reservation = req.body;
    // db.ref('tables').once("value", function(snapshot) {
    //     var tables = snapshot.numChildren();
    //     if (tables >= 5) {
    //         db.ref('waitlist').push(reservation);
    //     } else {
    //         db.ref('tables').push(reservation);
    //     }
    // })
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'app/404/404.html'));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
	console.log('App listening on PORT ' + PORT);
});
