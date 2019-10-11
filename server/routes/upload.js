const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', (req, res) => {

    let type = req.params.type;
    let id = req.params.id;

    if(!req.files) {
        return res.status(400)
                    .json({
                        ok: false,
                        err: {
                            message: 'Any file was selected'
                        }
                    })
    }

    //type
    let allowTypes = ['products', 'users'];
    if( allowTypes.indexOf( type ) < 0 ) {
        return res.status(400)
                    .json({
                        ok: false,
                        err: {
                            message: `The types allow are ${allowTypes.join(', ')}`,
                            type
                        }
                    })
    }

    let sampleFile = req.files.file;
    let nameFile = sampleFile.name.split('.');
    let extension = nameFile[nameFile.length - 1];

    // Allow extensions
    let allowExtensions = ['png','jpg','gif','jpeg'];

    if(allowExtensions.indexOf( extension ) < 0 ) {
        return res.status(400)
                    .json({
                        ok: false,
                        err: {
                            message: `The extensions allow are ${allowExtensions.join(', ')}`,
                            ext: extension
                        }
                    })
    }

    //Rename file
    let finalNameFile = `${ id }-${Math.random()}.${extension}`

    sampleFile.mv(`uploads/${type}/${finalNameFile}`, (err) => {
        if(err) {
            return res.status(500)
                        .json({
                            ok: false,
                            err
                        })
        }

        setImage(id,res,finalNameFile,type);
       
    })
});

function setImage(id,res,nameFile, type){

    switch(type) {
        case 'users':
            userImage(id, res, nameFile, type);
            break;
        case 'products':
            productImage(id,res,nameFile, type);
            break;
        default:
            break;
    }
}

function userImage(id, res, nameFile, type) {

    User.findById(id, (err, userDB) => {

        if(err) {
            deleteFile(nameFile, type);
            return res.status(500)
                        .json({
                            ok: false,
                            err
                        })
        }

        if( !userDB ) {
            deleteFile(nameFile, type);
            return res.status(404)
                        .json({
                            ok: false,
                            err: {
                                message: `User with id: ${id} not found`
                            }
                        })
        }

        userDB.img = nameFile;

        deleteFile(nameFile, type);

        userDB.save( (err, userUpdated) => {
            if(err) {
                return res.status(500)
                            .json({
                                ok: false,
                                err
                            })
            }
            res.json({
                ok: true,
                user: userUpdated,

            })
        })


    })

}

function productImage(id, res, nameFile, type) {

    Product.findById(id, (err, productDB) => {

        if(err) {
            deleteFile(nameFile, type);
            return res.status(500)
                        .json({
                            ok: false,
                            err
                        })
        }

        if( !productDB ) {
            deleteFile(nameFile, type);
            return res.status(404)
                        .json({
                            ok: false,
                            err: {
                                message: `Product with id: ${id} not found`
                            }
                        })
        }

        productDB.img = nameFile;

        deleteFile(nameFile, type);

        productDB.save( (err, productUpdated) => {
            if(err) {
                return res.status(500)
                            .json({
                                ok: false,
                                err
                            })
            }
            res.json({
                ok: true,
                product: productUpdated,

            })
        })


    })
}

function deleteFile(imageName, type){

    let pathImage = path.resolve( __dirname, `../../uploads/${type}/${imageName}` );  
    if(fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;