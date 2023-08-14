const route = require('express').Router()
const {
    GetClientes,
    GetClienteXIdentificacion,
    GetClienteXNombre,
    GetGestionesXCliente,
    PostNuevaGestion,
    GetDataClientes
} = require('../../controllers/v1/Portafolios_Controller')



route.post('/id',GetClienteXIdentificacion)
route.post('/nombre',GetClienteXNombre)
route.post('/gestiones/agregar',PostNuevaGestion)
route.get('/data/cliente/:id',GetDataClientes)


route.get('/gestiones/:id',GetGestionesXCliente)
route.get('/:vendedorId',GetClientes)

module.exports = route