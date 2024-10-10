const { ObtenerCiudades_Controller, ObtenerDepartamentos_Controller, obtenerCiudadesXDepartamento_Controller } = require('../../controllers/v1/Ciudades/Ciudades_Controller')
const ciudadesXDepartamentoCacheMiddleware = require('../../middlewares/Cache/CiudadesXDepartamentoCache_Middleware')
const departamentosCacheMiddleware = require('../../middlewares/Cache/DepartamentosCache_Middleware')

const route = require('express').Router()

route.get('/', ObtenerCiudades_Controller)
route.get('/departamentos', departamentosCacheMiddleware, ObtenerDepartamentos_Controller)
route.get('/:departamento', ciudadesXDepartamentoCacheMiddleware, obtenerCiudadesXDepartamento_Controller)


module.exports = route