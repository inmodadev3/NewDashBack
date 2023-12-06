const { GetPedidos, GetDetallePedidos } = require('../../controllers/v1/Procesos_Pedidos_Controller')

const route = require('express').Router()

route.get('/detalles', GetDetallePedidos)
route.get('/:strIdVendedor',GetPedidos)

module.exports = route