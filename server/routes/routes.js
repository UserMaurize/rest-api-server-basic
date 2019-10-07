
const express = require('express');

const app = express();

//routes
app.use( require('./user') );
app.use( require('./login') );

module.exports = app;