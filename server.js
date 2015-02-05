// jshint node: true

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var userToJsonLD = require('./util/userToJsonld').toJsonLD;

// MODEL
var User = require('./app/models/user');

// RESPONSE CONFIG
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// SERVER CONFIG
var port = process.env.PORT || 8080;        // set our port
var urlServer = 'http://vps.schrodingerscat.ovh';
var urlAPI = '/api';
var urlUser = '/user';

// MONGODB CONFIG
var mongoDatabaseName = 'bugtracker';

// MINIMAL PERSISTENCE USING MONGODB
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/' + mongoDatabaseName);

// get an instance of the express Router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    "use strict";
    console.log(req.method, " " ,req.originalUrl);
    next();
});

// ROUTES DEFINITIONS
router.get('/', function(req, res) {
    "use strict";
    res.set('Link',
        '<http://vps.schrodingerscat.ovh/api/doc/>; rel=\"http://www.w3.org/ns/hydra/core#apiDocumentation\"');
    res.set('Content-Type', 'application/ld+json');
    var rstream = fs.createReadStream('./doc/entryPoint.jsonld');
    rstream.pipe(res);
});

// Angular Front-end files
app.use('/public', express.static(__dirname + '/public'));

// DOC
router.get('/doc', function(req, res) {
    "use strict";
    var rstream = fs.createReadStream('./doc/apiDocumentation.jsonld');
    res.set('Content-Type', 'application/ld+json');
    res.set('Link',
        '<' + urlServer + '/api/doc/>; rel=\"http://www.w3.org/ns/hydra/core#apiDocumentation\"');
    rstream.pipe(res);
});

router.route('/user')
    .post(function(req, res) {
        "use strict";
        var user = new User();
        user.givenName = req.body.givenName;
        user.familyName = req.body.familyName;

        user.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: ' created!' });
        });
    })

    // get all users
    .get(function(req, res) {
        "use strict";
        User.find(function (err, users) {
            if (err) {
                res.send(err);
            }
            // Add the schema.org/Person context to each object
            users.map(function(usr) {
                userToJsonLD(usr, urlAPI, urlUser);
            });

            res.set('Content-Type', 'application/ld+json');
            res.json(users);
        });
    });

router.route(urlUser + '/:userId')
    .get(function(req, res) {
        "use strict";
        User.findById(req.params.userId, function(err, user) {
            if (err) {
                res.send(err);
            }

            user = userToJsonLD(user, urlAPI, urlUser);

            res.set('Content-Type', 'application/ld+json');
            res.json(user);
        });
    });


// REGISTER OUR ROUTES
app.use(urlAPI, router);

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);

