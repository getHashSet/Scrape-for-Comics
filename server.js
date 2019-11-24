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
app.use(express.urlencoded({ extended: true}));
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
db.on("error", function(err) {
    console.log("Database Error: ", err);
});

///////////////////////////////////////////////
// Routes
///////////////////////////////////////////////

// root level
app.get("/", function(req, res) {
    res.sendFile(path.join(`${__dirname}/public/index.html`));
});

///////////////////////////////////////////////
// Listen Here You
///////////////////////////////////////////////

app.listen( 3000, function() {
    console.log(`localhost:3000`);
});