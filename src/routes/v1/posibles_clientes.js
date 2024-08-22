const {
    CrearPosibleCliente_Controller,
    ActualizarInformacionPosibleCliente_Controller,
    ConsultarXEstado_Controller,
    ConsultarXBusqueda_Controller,
    ActualizarEstado_Controller,
    EditarInfomacionPosibleCliente_Controller
} = require('../../controllers/v1/PosiblesClientes/PosiblesClientes_Controller')

const route = require('express').Router()

route.post('/', CrearPosibleCliente_Controller)
route.put('/', ActualizarInformacionPosibleCliente_Controller)
route.get('/', ConsultarXEstado_Controller)
route.get('/:dato', ConsultarXBusqueda_Controller)
route.put('/:id', ActualizarEstado_Controller)
route.put('/info/:id', EditarInfomacionPosibleCliente_Controller)



module.exports = route