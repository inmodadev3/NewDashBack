const { post_Login } = require('../../controllers/tienda/Login_Controller')

const route = require('express').Router()

route.post('/',post_Login)


module.exports = route