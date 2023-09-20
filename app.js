require("dotenv").config();
const express = require('express');
const session = require('express-session');
const app = express();
const api_doc = require('./api-doc/doc');

const routes = require("./src/routes");

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    next();
});
app.use(
  session({
    secret: 'mail-file',
    resave: false,
    saveUninitialized: false
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api-docs', api_doc);

app.use('/api', routes);
app.get("*", (req, res) => {
  return res.status(404).json({
    message: "API endpoint not found"
    });
});

console.log("ENV: ", app.get('env'));
process.env.NODE_ENV = app.get('env');

module.exports = app;