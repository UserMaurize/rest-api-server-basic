
const express = require('express');

const app = express();

//routes
app.use( require('./user') );
app.use( require('./login') );
app.use( require('./category'));
app.use( require('./product') );

module.exports = app;