const { GetFacturas, GetCartera, GetRecaudos, GetLiquidadas, GetCarteraCiudades } = require('../../controllers/v1/Movimientos_Controller')

const route = require('express').Router()

route.get('/facturas',GetFacturas)
route.get('/cartera',GetCartera)
route.get('/recaudos',GetRecaudos)
route.get('/liquidadas',GetLiquidadas)
route.get('/cartera_ciudades',GetCarteraCiudades)

module.exports = route