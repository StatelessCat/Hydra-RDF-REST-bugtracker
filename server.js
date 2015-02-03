var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// MODEL
var User = require('./app/models/user');

// RESPONSE CONFIG
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// SERVER CONFIG
var port = process.env.PORT || 8080;        // set our port

// MONGODB CONFIG
var mongoDatabaseName = 'bugtracker';

// MINIMAL PERSISTENCE USING MONGODB
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/' + mongoDatabaseName);

// get an instance of the express Router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log(req.method, " " ,req.originalUrl);
    next();
});

// ROUTES DEFINITIONS
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our bugtracker api!' });
});

router.route('/user')
    .post(function(req, res) {

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
        User.find(function (err, users) {
            if (err) {
                res.send(err);
            }
            // Add the schema.org/Person context to each object
            users.forEach(function(usr) {
                usr._doc["@context"] = { "@vocab" : "http://schema.org/" };
                usr._doc["@type"] = "Person";
                usr._doc["@id"] = usr._doc["_id"];

                usr._doc["_id"] = {}; // we don't need this anymore
                usr._doc["__v"] = {}; // we don't need this
            });
            res.json(users);
        });
    });

router.route('/user/:user_id')
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    });


// REGISTER OUR ROUTES
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('Magic happens on port ' + port);
