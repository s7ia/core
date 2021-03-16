const dotenv = require("dotenv").config();

// bootstrap express server

const express = require("express");

const app = express();

const port = process.env.HTTP_PORT || 8080;

app.use(express.json());

app.listen(port, function () {
	console.log ("|=============================================================|")
	console.log ("| Core: Express on port ("+ port + ") started successfully.    ")
	console.log ("|=============================================================|")
});


// connect to mongo db server

const mongoose = require ("mongoose");

mongoose.connect(process.env.MDATABASE, { useNewUrlParser: true, useUnifiedTopology: true} , function () {
	console.log ("|=============================================================|")
	console.log ("| Core: Connected to MongoDB.                                  ")
	console.log ("|=============================================================|")

});


// bootstrap api


app.use ("/api/user", require("./api/userApi"));

console.log ("|=============================================================|")
console.log ("| Core: API initialized.                                       ")
console.log ("|=============================================================|")
