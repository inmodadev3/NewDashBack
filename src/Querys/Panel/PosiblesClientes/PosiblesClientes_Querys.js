const PosiblesClientes_Model = require("../../../Models/v1/PosiblesClientes_Model/PosiblesClientes_Model")
const { obtenerDatosDb_Dash } = require("../../Global_Querys")


const CrearNuevoPosibleCliente_Query = async (cliente) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                nombreCliente,
                nombreLocal,
                segmento,
                telefono,
                celular,
                linea,
                comentario,
                fechaCreacion,
                ciudad,
            } = cliente

            const query = PosiblesClientes_Model.CrearNuevoPosibleCliente_Model()
            await obtenerDatosDb_Dash(query, [
                nombreCliente,
                nombreLocal,
                segmento,
                telefono,
                celular,
                linea,
                comentario,
                fechaCreacion,
                ciudad,
                1
            ])

            resolve(true)
        } catch (error) {
            reject(error)
        }
    })


}

const ActualizarInformacionPosibleCliente_Query = async (id, strVendedor, fechaGestion, Comentario, estado) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = PosiblesClientes_Model.ActualizarPosibleCliente_Model()
            await obtenerDatosDb_Dash(query, [
                strVendedor,
                fechaGestion,
                Comentario,
                estado,
                id
            ])

            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}

const ConsultarPosiblesClientesXEstado_Query = async (estado) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = PosiblesClientes_Model.ConsultarPosibleClienteXEstado_Model()
            const clientes = await obtenerDatosDb_Dash(query, [estado])
            resolve(clientes)
        } catch (error) {
            reject(`${error}`)
        }
    })
}

const ConsultarPosibleClienteXBusqueda = async (tipoBusqueda, datoBusqueda) => {
    return new Promise(async (resolve, reject) => {
        try {
            let tipo = tipoBusquedaCases(tipoBusqueda)
            const query = `SELECT * FROM TblPosiblesClientes where ${tipo} Like '%${datoBusqueda}%'`
            const cliente = await obtenerDatosDb_Dash(query)
            resolve(cliente)
        } catch (error) {
            reject(`${error}`)
        }
    })
}

const tipoBusquedaCases = (tipoBusqueda) => {
    let busqueda;
    switch (tipoBusqueda) {
        case '2':
            busqueda = 'strNombreLocal'
            break;
        case '3':
            busqueda = 'strCelular'
            break;
        case '4':
            busqueda = 'intId'
            break;
        default:
            busqueda = 'strNombreCliente'
            break;
    }

    return busqueda
}

const ActualizarEstado_Query = (estado, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = PosiblesClientes_Model.ActualizarEstado()
            await obtenerDatosDb_Dash(query, [estado, id])
            resolve(true)
        } catch (error) {
            reject(`${error}`)
        }
    })
}

const EditarInfomacionPosibleCliente_Query = async (cliente, id) => {
    return new Promise(async (resolve, reject) => {
        try {

            const {
                nombreCliente,
                nombreLocal,
                segmento,
                telefono,
                celular,
                linea,
                comentario,
                ciudad
            } = cliente


            const query = PosiblesClientes_Model.EditarDatosCliente_Model()
            await obtenerDatosDb_Dash(query, [
                nombreCliente,
                nombreLocal,
                segmento,
                telefono,
                celular,
                linea,
                comentario,
                ciudad,
                id
            ])
            resolve(true)
        } catch (error) {
            reject(`${error}`)
        }
    })
}

const ValidarExistente_Query = async (celular) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = PosiblesClientes_Model.ValidarExistente_Model()
            const validar = await obtenerDatosDb_Dash(query, [celular])
            resolve(validar[0].existe)
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    CrearNuevoPosibleCliente_Query,
    ActualizarInformacionPosibleCliente_Query,
    ConsultarPosiblesClientesXEstado_Query,
    ConsultarPosibleClienteXBusqueda,
    ActualizarEstado_Query,
    EditarInfomacionPosibleCliente_Query,
    ValidarExistente_Query
}