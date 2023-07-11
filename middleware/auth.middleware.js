const jwt = require("jsonwebtoken")
require("dotenv").config();

const authorization = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const decode = jwt.verify(token, process.env.SECRET_KEY)

        if (decode) {
            console.log(req.body)
            req.body.userId = decode.userId;
            req.body.username = decode.username;
            next()
        }
        else {
            res.status(400).send({ "msg": "Please Login First !!" })
        }
    } else {
        res.status(400).send({
            "msg": "Please Login First !!"
        })
    } 
}

module.exports = {
    authorization
}