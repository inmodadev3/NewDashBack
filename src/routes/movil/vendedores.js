const { Login } = require('../../controllers/movil/Vendedores_Controller')

const route = require('express').Router()

route.post('/', Login)


module.exports = route