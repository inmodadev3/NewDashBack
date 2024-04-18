const { obtenerDatosDb_Dash } = require("../Global_Querys")

const Consultar_PedidosEnProceso = (strIdVendedor) =>{
    return new Promise(async(resolve, reject) => {
        try {
            const query = `SELECT * FROM dash.tblpedidostienda where strIdVendedor = ? order by intEstado, dtFechaInicio desc limit 20 offset 0`

            const data = await obtenerDatosDb_Dash(query,[strIdVendedor])
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const Consultar_Detalles_Pedido_Proceso = (id) =>{
    return new Promise(async(resolve, reject) => {
        try {
            const query = `select * from dash.tbldetallepedidostienda where intIdPedido = ? and intEstado = 1`
            const data = await obtenerDatosDb_Dash(query,[id])
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    Consultar_PedidosEnProceso,
    Consultar_Detalles_Pedido_Proceso,
    
}