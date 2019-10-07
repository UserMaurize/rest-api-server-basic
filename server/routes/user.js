const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const User = require('../models/user');

const { verifyToken, verifyRole } = require('../middlewares/autentication');

const app = express();

app.get('/users', verifyToken, (req, res) => {
    
    let from = req.query.from || 0;
    from = Number(from);
    let until = req.query.until || 20;
    until = Number(until);
    User.find({}, 'name email status role google')
        .skip(from)
        .limit(until)
        .exec( (err, users) => {

            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            User.countDocuments({}, (err, count) => {
                res.json({
                    ok:true,
                    users,
                    count
                });
            });
        });

  });
  
  app.post('/user', [verifyToken, verifyRole], (req, res) => {
  
      let body = req.body;
  
        let user = new User({
            name: body.name,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        });

        user.save( (err, userDB) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                user: userDB
            })

        });



    //   if(body.name === undefined) {
    //       res.status(400).json({
    //           ok: false,
    //           name: 'Is mandatory'
    //       })
    //   } else{
    //       res.json({
    //           body
    //       });
    //   }
      
  
    });
  
  app.put('/user/:id', [verifyToken, verifyRole], (req, res) => {
  
      let id = req.params.id;
      let body =  _.pick( req.body, ['name','email','img','role','status'] );

      let options = {
          new: true,
          runValidators:true
      }
      User.findByIdAndUpdate( id, body, options, (err, userDB) => {
          
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            user: userDB
        })
      });
  });
  
  app.delete('/user/:id', [verifyToken, verifyRole], (req, res) => {
      
    let id = req.params.id;

    // User.findByIdAndRemove(id, (err, userDeleted) => {

    //     if(err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }

    //     if(!userDeleted) {
    //         return res.status(400).json({
                
    //             ok:false,
    //             err: {
    //                 message: 'User not found'
    //             }

    //         })
    //     }

    //     res.json({
    //         ok:true,
    //         user: userDeleted
    //     })
        
    // }); 

    let options = {
        new: true
    } 
    User.findByIdAndUpdate(id, {status: false}, options, (err, userDeleted) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!userDeleted) {
            return res.status(400).json({
                
                ok:false,
                err: {
                    message: 'User not found'
                }

            })
        }

        res.json({
            ok:true,
            user: userDeleted
        })
        
    }); 



  });

  module.exports = app;