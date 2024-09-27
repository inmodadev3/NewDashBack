const { ObtenerCiudades_Controller } = require('../../controllers/v1/Ciudades/Ciudades_Controller')

const route = require('express').Router()

route.get('/', ObtenerCiudades_Controller)


module.exports = route