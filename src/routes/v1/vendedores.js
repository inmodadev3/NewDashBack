const { GetVendedores_Controller } = require('../../controllers/v1/Vendedores/Vendedores_Controller')

const route = require('express').Router()

route.get('/', GetVendedores_Controller)

module.exports = route