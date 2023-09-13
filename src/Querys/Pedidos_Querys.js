const { obtenerDatosDB_Hgi, obtenerDatosDb_Dash } = require('./Global_Querys')

const GetPedidosNuevos_Query = async() =>{
    return new Promise(async(resolve,reject)=>{
        try {
            const query = `SELECT intIdPedido,strIdPedidoVendedor,strNombVendedor,strNombCliente,dtFechaFinalizacion,dtFechaEnvio,intValorTotal FROM tblPedidos where intEstado = 1`
            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetPedidosEnProceso_query = async() =>{
    return new Promise(async(resolve,reject)=>{
        try {
            const query = `SELECT intIdPedido,strIdPedidoVendedor,strNombVendedor,strNombCliente,dtFechaFinalizacion,dtFechaEnvio,intValorTotal FROM tblPedidos where intEstado in (2,3,4,5) order by intIdPedido desc limit 80 offset 0 `
            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetPedidosEnTerminal_Query = async() =>{
    return new Promise(async(resolve,reject)=>{
        try {
            const query = `SELECT intIdPedido,strNombVendedor,strNombCliente,intValorTotal,dtFechaEnvio FROM tblPedidosterminal where intEstado = 1 order by intIdPedido desc`
            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetInfoPedido_Query = async(id) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            const query = `SELECT * FROM tbldetallepedidos where intIdpedido = ?`;
            const queryCabecera = `SELECT strIdCliente,strNombCliente,strCiudadCliente,strTelefonoClienteAct,dtFechaEnvio,strNombVendedor,intIdpedido,strCorreoClienteAct,strObservacion,intValorTotal FROM tblpedidos where intIdPedido = ?`;

            const data = await obtenerDatosDb_Dash(query,[id])
            const header = await obtenerDatosDb_Dash(queryCabecera,[id])
            resolve({data,header})
        } catch (error) {
            reject(error)
        }
    })
}

const GetInfoPedidoTerminal_Query = async(id) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            const query = `SELECT * FROM tbldetallepedidosterminal where intIdpedido = ?`;
            const queryCabecera = `SELECT strIdCliente,strNombCliente,strCiudadCliente,strTelefonoClienteAct,dtFechaEnvio,strNombVendedor,intIdpedido FROM tblpedidosterminal where intIdPedido = ?`;
            const rows = await obtenerDatosDb_Dash(query,[id])
            const header = await obtenerDatosDb_Dash(queryCabecera,[id])
    
            let detallePedido = [];
    
            for (const item of rows) {
                let ubicaciones = await GetUbicaciones(item.strIdProducto);
                detallePedido.push({ ...item, ubicaciones: ubicaciones[0].StrParam2 });
            }
            
            resolve({detallePedido,header})
        } catch (error) {
            reject(error)
        }
    })
}

const GetPedidoXId_Query = async(id) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            const query = `SELECT intIdPedido,strIdPedidoVendedor,strNombVendedor,strNombCliente,dtFechaFinalizacion,dtFechaEnvio,intValorTotal FROM tblPedidos where intIdPedido like '${id}%' order by intIdPedido desc limit 80 offset 0`

            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    GetPedidosNuevos_Query,
    GetPedidosEnProceso_query,
    GetPedidosEnTerminal_Query,
    GetInfoPedido_Query,
    GetInfoPedidoTerminal_Query,
    GetPedidoXId_Query
}