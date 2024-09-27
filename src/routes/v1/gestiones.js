const { ObtenerGestiones_Controller } = require('../../controllers/v1/Gestiones/gestiones')

const route = require('express').Router()

route.get('/', ObtenerGestiones_Controller)

module.exports = route