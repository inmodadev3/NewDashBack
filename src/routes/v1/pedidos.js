const route = require('express').Router()
const {
    GetPedidosEnProceso,
    GetPedidosNuevos,
    GetPedidosEnTerminal,
    GetInfoPedido,
    GetInfoPedidoTerminal,
    GetPedidoXId,
    GetPedidos,
    PutEstadoPedido
} = require('../../controllers/v1/Pedidos_Controller')

route.get('/',GetPedidos)
route.get('/nuevos',GetPedidosNuevos)
route.get('/proceso',GetPedidosEnProceso)
route.get('/terminal',GetPedidosEnTerminal)
route.get('/detalle_pedido/terminal/:id',GetInfoPedidoTerminal)
route.get('/detalle_pedido/:id',GetInfoPedido)
route.get('/id/:id',GetPedidoXId)

route.put('/actualizar_estado',PutEstadoPedido)

module.exports = route