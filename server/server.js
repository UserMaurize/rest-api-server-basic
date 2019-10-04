require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

//routes
app.use( require('./routes/user') );


mongoose.connect(process.env.URLDB, {
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
 
app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
});