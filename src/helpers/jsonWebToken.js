const jwt = require('jsonwebtoken')
const secretKey = "sistemasinmoda123*"

const verifyToken = (req, res, next) => {
    try {
        const BearerHeader = req.headers['authorization']

        if (typeof BearerHeader !== 'undefined') {
            const Token = BearerHeader.split(" ")[1]
            jwt.verify(Token, secretKey, (err, data) => {
                if (err) {
                    res.status(498)
                    res.json({ ErrorMessage: "Token invalid" })
                } else {
                    next()
                }
            })
        } else {
            res.json({ ErrorMessage: "Error token" })
            res.status(403)
        }
    } catch (error) {
        res.status(400).json({error,message:"Ha ocurrido un error con la verificación del token"})
    }
}


module.exports = verifyToken