const express = require('express');

const fs = require('fs');

const path = require('path');

const { verifyTokenInImage } = require('../middlewares/autentication');

const app = express();


app.get('/image/:tipe/:img', verifyTokenInImage, (req, res) => {

    let type = req.params.type;
    let img = req.params.img;

    let pathImg = `./uploads/${ type }/${ img }`;

    let pathImage = path.resolve( __dirname, `../../uploads/${type}/${img}` ); 
    if(fs.exists(pathImage)) {
        res.sendFile(  pathImage  );
    } else {
        let noImagePath = path.resolve( __dirname, '../assets/no-image.jpg' );
        res.sendFile(noImagePath);
    }



});


module.exports = app;