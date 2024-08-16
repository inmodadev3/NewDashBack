const { CrearNuevoPosibleCliente_Query, ActualizarInformacionPosibleCliente_Query, ConsultarPosiblesClientesXEstado_Query, ConsultarPosibleClienteXBusqueda, ActualizarEstado_Query } = require("../../../Querys/Panel/PosiblesClientes/PosiblesClientes_Querys")

const PosiblesClientes_Controller = {}

PosiblesClientes_Controller.CrearPosibleCliente_Controller = async (req, res) => {
    const { cliente } = req.body

    try {
        if (!cliente) res.status(400).json({ message: `Cliente invalido` })
        const data = await CrearNuevoPosibleCliente_Query(cliente)

        if (!data) res.status(400).json({ error: `${data}`, message: `Ha ocurrido un error al crear el cliente` })

        res.status(200).json({ message: 'Posible Cliente Creado Con Exito' })

    } catch (error) {
        res.status(400).json({ error: `${error}`, message: `Ha ocurrido un error al crear el cliente` })
    }
}

PosiblesClientes_Controller.ActualizarInformacionPosibleCliente_Controller = async (req, res) => {
    const {
        strVendedor,
        dtFechaUltimaGestion,
        strComentario,
        intEstado,
        intId
    } = req.body
    try {
        const data = await ActualizarInformacionPosibleCliente_Query(
            intId,
            strVendedor,
            dtFechaUltimaGestion,
            strComentario,
            intEstado
        )

        if (!data) res.status(400).json({ error: `${error}`, message: `Ha ocurrido un error al actualizar el cliente` })
        res.status(200).json({ message: 'Posible Cliente Actualizado Con Exito' })

    } catch (error) {
        res.status(400).json({ error: `${error}`, message: `Ha ocurrido un error al actualizar el cliente` })
    }
}

PosiblesClientes_Controller.ConsultarXEstado_Controller = async (req, res) => {

    const { estado } = req.query

    try {
        const clientes = await ConsultarPosiblesClientesXEstado_Query(estado)
        res.status(200).json({ clientes })

    } catch (error) {
        res.status(400).json({ error: `${error}`, message: `Ha ocurrio un error al consultar los clientes.` })

    }
}

PosiblesClientes_Controller.ConsultarXBusqueda_Controller = async (req, res) => {
    const { dato } = req.params
    const { tipo } = req.query

    try {
        const cliente = await ConsultarPosibleClienteXBusqueda(tipo, dato)
        res.status(200).json({ cliente })

    } catch (error) {
        res.status(400).json({ error: `${error}`, message: `Ha ocurrio un error al consultar los clientes.` })
    }
}

PosiblesClientes_Controller.ActualizarEstado_Controller = async (req, res) => {
    const { id } = req.params
    const { estado } = req.body

    try {
        const data = await ActualizarEstado_Query(estado, id);
        if (!data) res.status(400).json({ error: `${error}`, message: `Ha ocurrido un error al actualizar el estado` })
        res.status(200).json({ message: 'Actualizado Con Exito' })
    } catch (error) {
        res.status(400).json({ error: `${error}`, message: `Ha ocurrido un error al actualizar el estado` })
    }
}

module.exports = PosiblesClientes_Controller