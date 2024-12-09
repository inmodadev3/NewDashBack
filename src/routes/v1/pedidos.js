const route = require('express').Router()
const {
    GetPedidosEnProceso,
    GetPedidosNuevos,
    GetPedidosEnTerminal,
    GetInfoPedido,
    GetInfoPedidoTerminal,
    GetPedidoXId,
    GetPedidos,
    PutEstadoPedido,
    PutEstadoProductoPedido,
    PostProductoPedido,
    PutActualizarPreciosPedido,
    GetReporteDropiPendientes,
    GetReporteDropi,
    GetReportesDropiCartera,
    enviarPedidoHgi_Controller,
    enviarMultiplesPedidosHgi_Controller,
    duplicarPedidosDash_Controller,
} = require('../../controllers/v1/Pedidos/Pedidos_Controller')

const {
    ConsultarEncargados,
    obtenerDatosSeguimiento,
    AgregarSeguimiento,
    ObtenerSeguimientos,
    ConsultarEncargadosDefault,
    CrearEncargado,
    BuscarSeguimiento,
    ActualizarEncargadosSeguimientos
} = require('../../controllers/v1/Pedidos/Seguimientos_Controller')

route.get('/', GetPedidos)
route.get('/reportes/dropi/pendientes', GetReporteDropiPendientes)
route.get('/reportes/dropi', GetReporteDropi)
route.get('/reportes/dropi/cartera', GetReportesDropiCartera)
route.get('/nuevos', GetPedidosNuevos)
route.get('/proceso', GetPedidosEnProceso)
route.get('/terminal', GetPedidosEnTerminal)
route.get('/encargados', ConsultarEncargados)
route.get('/seguimiento', obtenerDatosSeguimiento)
route.get('/seguimientos', ObtenerSeguimientos)
route.get('/seguimientos/id/:busqueda', BuscarSeguimiento)
route.get('/detalle_pedido/terminal/:id', GetInfoPedidoTerminal)
route.get('/detalle_pedido/:id', GetInfoPedido)
route.get('/id/:id', GetPedidoXId)

route.get('/encargadosDefault', ConsultarEncargadosDefault)

route.put('/actualizar_estado', PutEstadoPedido)
route.put('/producto', PutEstadoProductoPedido)
route.put('/precios_productos', PutActualizarPreciosPedido)

route.post('/seguimiento', AgregarSeguimiento)
route.post('/producto', PostProductoPedido)
route.post('/encargado', CrearEncargado)
route.post('/seguimiento/encargados', ActualizarEncargadosSeguimientos)
route.post('/enviar/hgi', enviarPedidoHgi_Controller)
route.post('/enviar_multiples/hgi', enviarMultiplesPedidosHgi_Controller)
route.post('/duplicar', duplicarPedidosDash_Controller)


module.exports = route