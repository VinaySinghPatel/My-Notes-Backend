const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SecretKey = "VinayPatel";


const myLogger = function (req, res, next) {
    const token = req.header('AuthToken');
    if(!token){
        return res.status(401).send({error:"Token is missing"});
    }
    try {
        let data = jwt.verify(token,SecretKey);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error:"Please authenticate using a valid token"});
        console.log(error)
    }
}

module.exports = myLogger;