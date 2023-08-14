const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRETKEY_JWT 

const verifyToken = (req,res,next) =>{
    const BearerHeader = req.headers['authorization']

    if(typeof BearerHeader !== undefined){
        const Token = BearerHeader.split(" ")[1]
        jwt.verify(Token,secretKey,(err,data)=>{
            if(err){
                res.status(403)
                res.json({ErrorMessage:"Token invalid"})
            }else{
                next()
            }
        })
    }else{
        res.json({ErrorMessage:"Error token"})
        res.status(403)
    }
}


module.exports = verifyToken