const express = require('express');

let { verifyToken } = require('../middlewares/autentication');

const app = express();

const Product = require('../models/product');


app.get('/product', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);
    let until = req.query.until || 20;
    until = Number(until);

        Product.find({})
            .populate(['user', 'category'])
            .skip(from)
            .limit(until)
            .exec( (err, products) => {

                if(err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
    
                Product.countDocuments({}, (err, count) => {
                    res.json({
                        ok:true,
                        products,
                        count
                    });
                });

            })

});

app.get('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Product
        .populate(['User', 'Category'])
        .findById(id, (err, productDB) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if(!productDB) {
            return res.status(404).json({
                ok:false,
                err: {
                    message: 'Product not found'
                }
            })
        } else {
            return res.json({
                ok: true,
                productDB

            })
        }

    });
});

app.get('/product/search/:filter', verifyToken, (req, res) => {

    let filter = req.params.filter;

    let regExp = new RegExp(filter, 'i')
   
    Product
        .find({ name: regExp })
        .populate(['user', 'category'])
        .exec( (err, products) => {
            console.log(products);
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Product.countDocuments({}, (err, count) => {
                res.json({
                    ok:true,
                    products,
                    count
                });
            });

        })


});

app.post('/product', verifyToken, (req, res) => {

    let userId = req.user._id;
   
    let body = req.body;
  
        let product = new Product({
            name: body.name,
            price: body.price,
            description: body.description,
            category: body.category,
            user: userId
        });

        product.save( (err, productDB) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productDB
            })

        });
});

app.put('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let options = {
        new: true,
        runValidators:true
    }

    Product.findByIdAndUpdate( id, body, options, (err, productDB) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            product: productDB
        })

    });

});

app.delete('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let options = {
        new: true
    } 
    Product.findByIdAndUpdate(id, {enable: false}, options, (err, productDisabled) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!productDisabled) {
            return res.status(400).json({
                
                ok:false,
                err: {
                    message: 'Product not found'
                }

            })
        }

        res.json({
            ok:true,
            product: productDisabled
        })
        
    }); 

});

module.exports = app;