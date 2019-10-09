
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();

const port = process.env.PORT || 3000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

//enabled folder public
app.use(  express.static( path.resolve(__dirname, '../public') )  );

//routes
app.use( require('./routes/routes') );

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if( err ) {
        throw err;
    }
    console.log('Database online');
});
 
app.listen(port, () => {
    console.log(`Express server listening on port ${port}.\nEnvironment: ${process.env.NODE_ENV}`);
});