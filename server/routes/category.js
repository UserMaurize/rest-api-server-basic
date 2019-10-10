
const express = require('express');

let { verifyToken } = require('../middlewares/autentication');

const app = express();

const Category = require('../models/category');



app.get('/category', verifyToken, (req, res) => {

    Category.find({})
            .sort('description')
            .populate('user')
            .exec( (err, categorys) => {

                if(err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
    
                Category.countDocuments({}, (err, count) => {
                    res.json({
                        ok:true,
                        categorys,
                        count
                    });
                });

            })
});


app.get('/category/:id', verifyToken, (req, res) => {

    let id= req.params.id;
    Category.findById( id, (err, categoryDB) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if(!categoryDB) {
            return res.status(404).json({
                ok:false,
                err: {
                    message: 'Category not found'
                }
            })
        } else {
            return res.json({

                ok: true,
                categoryDB

            })
        }

    });
});


app.post('/category', verifyToken, (req, res) => {

   let userId = req.user._id;

    let body = req.body;
  
        let category = new Category({
            description: body.description,
            user: userId
        });

        category.save( (err, categoryDB) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                category: categoryDB
            })

        });


});

app.put('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let options = {
        new: true,
        runValidators:true
    }

    Category.findByIdAndUpdate( id, body, options, (err, categoryDB) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            category: categoryDB
        })

    });


});

app.delete('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!categoryDB) {
            return res.status(400).json({
                
                ok:false,
                err: {
                    message: 'Category not found'
                }

            })
        }

        res.json({
            ok:true,
            category: categoryDB
        })

    });


});






module.exports = app;

