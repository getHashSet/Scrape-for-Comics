///////////////////////////////////////////////
// npm 
///////////////////////////////////////////////

const express = require("express");
const handlebars = require("express-handlebars");
const mongojs = require("mongojs");
const morgan = require("morgan");
const path = require("path");
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

///////////////////////////////////////////////
// Fancey Footwork
///////////////////////////////////////////////

// store express into a variable that we can call later.
let app = express();

// use morgan to check my routes in the terminal log.
app.use(morgan("dev"));

// return JSON objects
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// call the folder that loads client side.
// *note*  all content of this folder will be available to the user.
app.use(express.static("public"));

// set up database
let databaseURL = "comics";
let collections = ["comments"];

// add mongojs package to the databases we just declaired
let db = mongojs(databaseURL, collections);

// Log errors to the terminal
db.on("error", function (err) {
    console.log("Database Error: ", err);
});

///////////////////////////////////////////////
// Routes
///////////////////////////////////////////////

// root level
app.get("/", function (req, res) {
    res.sendFile(path.join(`${__dirname}/public/index.html`));
});


////////////
// create
////////////

// route for writing to our database
app.post("/api/add", function (req, res) {
    console.log(req.body);

    db.collections.insert(req.body, function (error, data) {
        // if error then log error else send the data.
        error ? console.error(error) : res.send(data);
    });
});


////////////
// read
////////////

// route for finding a specific comic/comment
app.get("/api/find/:id", function(req, res) {
    // find the id in the data base. If it finds it then send the data else log the error.
    db.collections.findOne(
    {
        _id: mongojs.ObjectId(req.params.id)
    },
        function(error, dataFound) {
            error ?
            console.error(error) :
            res.send(dataFound);
        }
    )
});

// display all content of the api in json format
app.get("/api/all", function (req, res) {
    // database go to collections and find all objects
    db.collections.find({}, function (err, dataFromDatabase) {
        err ? console.error(err) : res.json(dataFromDatabase);
    });
});


////////////
// update
////////////

// update the data inside the database.collection by _id using mongo schema
app.post("/api/update/:id", function (req, res) {
    // what did we get from the client?
    console.log(req.params.id);

    db.collections.update(
        {
            _id: mongojs.ObjectId(req.params.id)
        },
        {
            // this is the JSON structure sent in the request body.
            $set: {
                title: req.body.title,
                comment: req.body.comment,
                updated: Date.now()
            }
        },
        function(error, edited) {
            error ?
            console.error(error) :
            res.send(edited);
        }
    );
});



////////////
// delete
////////////

app.get("/api/delete/:id", function(req, res) {
    db.collections.remove(
        {
            _id: mongojs.ObjectId(req.params.id)
        },
        function(err, goodData) {
            err ?
            console.error(err) :
            res.send(goodData);
        }
    )
});

// BONUS DROP THE DATABASE

app.get ("/api/drop", function(req, res) {
    db.collections.remove({}, function(err, deleted) {
        err ?
        console.error(err) :
        res.send(deleted);
        console.log("You have dropped the DATABASE.");
    });
});

///////////////////////////////////////////////
// Listen Here You
///////////////////////////////////////////////

app.listen(3000, function () {
    console.log(`go to localhost:3000`);
});