const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const moment = require('moment');

const User = require('../models/user');

const app = express();


app.post('/login', (req,res) => {

    let body = req.body;

    //return only one
    User.findOne({ email: body.email }, ( err, userDB ) => {

        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        } 

        if(!userDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'User or Password not valid'
                }

            })
        }

        if( bcrypt.compareSync(body.password,userDB.password) ) {
            let expires = moment().utc().add({ days: 1 }).unix();
            console.log(expires);
            return res.json({
                ok:true,
                userDB,
                token: jwt.sign({
                    userDB
                }, process.env.JWT_SECRET, { expiresIn: expires })
            })
        }

        return res.status(404).json({
            ok: false,
            err: {
                message: 'User not found'
            }

        })

    })


})



module.exports = app;
