const route = require('express').Router()
const {
    GetPedidosEnProceso,
    GetPedidosNuevos,
    GetPedidosEnTerminal,
    GetInfoPedido,
    GetInfoPedidoTerminal,
    GetPedidoXId
} = require('../../controllers/v1/Pedidos_Controller')

route.get('/nuevos',GetPedidosNuevos)
route.get('/proceso',GetPedidosEnProceso)
route.get('/terminal',GetPedidosEnTerminal)
route.get('/detalle_pedido/terminal/:id',GetInfoPedidoTerminal)
route.get('/detalle_pedido/:id',GetInfoPedido)
route.get('/id/:id',GetPedidoXId)


module.exports = route