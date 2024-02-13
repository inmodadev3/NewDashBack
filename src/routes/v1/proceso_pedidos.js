const { cambiar_estado_pedidosTienda } = require('../../controllers/tienda/Pedidos_Controller')
const { GetPedidos, GetDetallePedidos } = require('../../controllers/v1/Procesos_Pedidos_Controller')

const route = require('express').Router()

route.get('/detalles', GetDetallePedidos)
route.get('/:strIdVendedor',GetPedidos)

route.put('/estado',cambiar_estado_pedidosTienda)


module.exports = route