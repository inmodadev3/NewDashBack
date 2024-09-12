const route = require('express').Router()
const { EditarGestion_Controller, EliminarGestion_Controller } = require('../../controllers/v1/Portafolios/Gestiones')
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





route.post('/id', GetClienteXIdentificacion)
route.post('/nombre', GetClienteXNombre)
route.post('/gestiones/agregar', PostNuevaGestion)
route.get('/data/cliente/:id', GetDataClientes)
route.post('/ciudades', obtenerCiudadesClientes)
route.post('/clientes_ciudades', obtenerClientesXCiudad)
route.put('/observacion', PutObservacion)
route.get('/gestiones/:id', GetGestionesXCliente)
route.put('/gestiones/editar', EditarGestion_Controller)
route.delete('/gestiones/eliminar/:id', EliminarGestion_Controller)
route.get('/:vendedorId', GetClientes)


module.exports = route