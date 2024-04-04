const route = require('express').Router()
const {
    GetClientes,
    GetClienteXIdentificacion,
    GetClienteXNombre,
    GetGestionesXCliente,
    PostNuevaGestion,
    GetDataClientes,
    obtenerCiudadesClientes,
    obtenerClientesXCiudad,
    PutObservacion
} = require('../../controllers/v1/Portafolios_Controller')





route.post('/id',GetClienteXIdentificacion)
route.post('/nombre',GetClienteXNombre)
route.post('/gestiones/agregar',PostNuevaGestion)
route.get('/data/cliente/:id',GetDataClientes)
route.post('/ciudades',obtenerCiudadesClientes)
route.post('/clientes_ciudades',obtenerClientesXCiudad)

route.get('/gestiones/:id',GetGestionesXCliente)
route.get('/:vendedorId',GetClientes)

route.put('/observacion',PutObservacion)

module.exports = route