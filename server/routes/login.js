const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);

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


});


async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
    
  }
 

app.post('/google', async (req,res) => {

    let token = req.body.idtoken;
    let expires = moment().utc().add({ days: 1 }).unix();

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            })
        })

    User.findOne( { email: googleUser.email }, (err, userDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( userDB ) {

            if(userDB.google === false) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'You must use authentication by App'
                    }
                });
            } else{ 
                let token = jwt.sign({
                    userDB
                }, process.env.JWT_SECRET, { expiresIn: expires })

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            }

        } else {
            //If user not exist on DB
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.picture;
            user.google = true;
            user.password = 'n';

            user.save(  (err, userGoogleDB) => {
                
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    userGoogleDB
                }, process.env.JWT_SECRET, { expiresIn: expires })

                return res.json({
                    ok: true,
                    user: userGoogleDB,
                    token
                })
            });
        }
    });

});



module.exports = app;
