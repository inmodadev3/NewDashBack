const { obtenerDatosDB_Hgi, obtenerDatosDb_Dash } = require('./Global_Querys')

const GetPedidos_Query = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT intIdPedido,strIdPedidoVendedor,strNombVendedor,strNombCliente,dtFechaFinalizacion,dtFechaEnvio,intValorTotal,intEstado FROM tblPedidos order by intIdPedido desc limit 80 offset 0`
            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetPedidosNuevos_Query = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT intIdPedido,strIdPedidoVendedor,strNombVendedor,strNombCliente,dtFechaFinalizacion,dtFechaEnvio,intValorTotal FROM tblPedidos where intEstado = 1`
            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetPedidosEnProceso_query = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT intIdPedido,strIdPedidoVendedor,strNombVendedor,strNombCliente,dtFechaFinalizacion,dtFechaEnvio,intValorTotal FROM tblPedidos where intEstado in (2,3,4,5) order by intIdPedido desc limit 80 offset 0 `
            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetPedidosEnTerminal_Query = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT intIdPedido,strNombVendedor,strNombCliente,intValorTotal,dtFechaEnvio FROM tblPedidosterminal where intEstado = 1 order by intIdPedido desc`
            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetUbicaciones = async (strIdProducto) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select StrParam2 from TblProductos where StrIdProducto = '${strIdProducto}'`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(err)
        }
    })
}

const GetInfoPedido_Query = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT * FROM tbldetallepedidos where intIdpedido = ?`;
            const queryCabecera = `SELECT strIdCliente,strNombCliente,strCiudadCliente,strTelefonoClienteAct,dtFechaEnvio,strNombVendedor,intIdpedido,strCorreoClienteAct,strObservacion,intValorTotal FROM tblpedidos where intIdPedido = ?`;
            let data = await obtenerDatosDb_Dash(query, [id])
            const header = await obtenerDatosDb_Dash(queryCabecera, [id])
            const array_productos = []
            for (const producto of data) {
                let ubicaciones = await GetUbicaciones(producto.strIdProducto)

                const ValidarPrecio = await ValidarPrecios_PDF(producto.strIdProducto, producto.intPrecio, header[0].strIdCliente)
                if (ValidarPrecio) {
                    await array_productos.push({
                        ...producto, ubicaciones: ubicaciones[0].StrParam2, precio_cambio: true
                    })
                } else {
                    await array_productos.push({
                        ...producto, ubicaciones: ubicaciones[0].StrParam2
                    })
                }


            }
            resolve({ data: array_productos, header })
        } catch (error) {
            reject(error)
        }
    })
}

const ValidarPrecios_PDF = (productoId, producto_Precio_Actual, terceroId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query_Precio = `select IntPrecio from TblTiposTercero as TiposT 
            inner join TblTerceros as T on TiposT.IntIdTipoTercero = T.IntTipoTercero
            where T.StrIdTercero = '${terceroId}'`

            const IntPrecio = await obtenerDatosDB_Hgi(query_Precio);
            if ((IntPrecio[0].IntPrecio).toString() !== '0') {
                const obtenerPrecioProducto_query = `Select intPrecio${IntPrecio[0].IntPrecio} from tblProductos where StrIdProducto = '${productoId}'`
                const Precio_Producto = await obtenerDatosDB_Hgi(obtenerPrecioProducto_query)
                const objeto = Precio_Producto[0];

                let valor;

                for (const propiedad in objeto) {
                    if (objeto.hasOwnProperty(propiedad)) {
                        valor = objeto[propiedad];
                        break; // Terminar el bucle después de encontrar la primera propiedad y su valor
                    }
                }

                if (producto_Precio_Actual !== valor) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }else{
                resolve(false)
            }

        } catch (error) {
            reject(error)
        }
    })
}

const GetInfoPedidoTerminal_Query = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT * FROM tbldetallepedidosterminal where intIdpedido = ?`;
            const queryCabecera = `SELECT strIdCliente,strNombCliente,strCiudadCliente,strTelefonoClienteAct,dtFechaEnvio,strNombVendedor,intIdpedido FROM tblpedidosterminal where intIdPedido = ?`;
            const rows = await obtenerDatosDb_Dash(query, [id])
            const header = await obtenerDatosDb_Dash(queryCabecera, [id])

            let detallePedido = [];

            for (const item of rows) {
                let ubicaciones = await GetUbicaciones(item.strIdProducto);
                detallePedido.push({ ...item, ubicaciones: ubicaciones[0].StrParam2 });
            }

            resolve({ detallePedido, header })
        } catch (error) {
            reject(error)
        }
    })
}

const GetPedidoXId_Query = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT intIdPedido,strIdPedidoVendedor,strNombVendedor,strNombCliente,dtFechaFinalizacion,dtFechaEnvio,intValorTotal,intEstado FROM tblPedidos where intIdPedido like '${id}%' order by intIdPedido desc limit 80 offset 0`

            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const PutEstadoPedido_Query = async (id, estado) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `UPDATE tblpedidos SET intEstado = ? where intIdPedido = ?`
            await obtenerDatosDb_Dash(query, [estado, id])
            resolve(1)
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
    GetPedidoXId_Query,
    GetPedidos_Query,
    PutEstadoPedido_Query
}