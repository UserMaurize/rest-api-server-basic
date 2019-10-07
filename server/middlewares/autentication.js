const jwt = require('jsonwebtoken');

//Verify Token

let verifyToken = (req, res, next) => {


    let token = req.get('Authorization');

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {

        if(err){
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.user = payload.user;
        next();

    });


};

let verifyRole = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify( token, process.env.JWT_SECRET, (err, payload) => {

        if(err){
            return res.status(401).json({
                ok: false,
                err
            })
        }

        if(payload.userDB.role !== 'ADMIN_ROLE') {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'User not autorhize for this request'
                }
            })
        } else {
            next();
        }


    })


}

module.exports = {
    verifyToken,
    verifyRole
}