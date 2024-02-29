const poolDash = require('../databases/DashConexion')
const { obtenerDatosDB_Hgi, obtenerDatosDb_Dash, obtenerDatosDb_Dash_transaccion } = require('./Global_Querys')

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
            const query = `SELECT * FROM tbldetallepedidos where intIdpedido = ? and intEstado != -1`;
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
            if (IntPrecio.length > 0) {
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
                } else {
                    resolve(false)
                }
            } else {
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

const PutTotalPrecioPedido_Query = async (id,total) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `UPDATE tblpedidos SET intValorTotal = ? where intIdPedido = ?`
            const data = await obtenerDatosDb_Dash(query, [total, id])
            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

const PutEstadoProductoPedido_query = async (id,valor,valor_total,tipo,pedidoId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let variable_actualizar = "intEstado"
            if(tipo == 1){
                variable_actualizar = "intEstado"
            }else{
                variable_actualizar = "intCantidad"
            }

            const query = `UPDATE tbldetallepedidos SET ${variable_actualizar} = ?  where intIdPedDetalle = ?`
            await obtenerDatosDb_Dash(query,[valor,id])
            await PutTotalPrecioPedido_Query(pedidoId,valor_total)
            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

const PostProductoPedido_query = async(idCliente,idProducto,idPedido)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            //obtener el ultimo id de la tabla tbldetallepedidos
            const ultimoId_query = `SELECT COALESCE((SELECT MAX(intIdPedDetalle) FROM dash.tbldetallepedidos), 0) as ultimoID`;
            const lastIdDet = await obtenerDatosDb_Dash(ultimoId_query);
            const nuevoIdDetalle = lastIdDet[0].ultimoID + 1;

            //obtener el precio del cliente
            const obtener_precioProducto_query = `select TTT.IntPrecio as tipo_precio from TblTerceros as TT
            inner join TblTiposTercero as TTT on TT.IntTipoTercero = TTT.IntIdTipoTercero
            where TT.StrIdTercero = '${idCliente}'`
            const obtener_precioProducto = await obtenerDatosDB_Hgi(obtener_precioProducto_query)

            //obtener los datos del producto
            const data_producto_query = `select StrIdProducto, StrDescripcion,StrUnidad,IntPrecio${obtener_precioProducto[0].tipo_precio} as precio from TblProductos
            where StrIdProducto = '${idProducto}'`
            const data_producto = await obtenerDatosDB_Hgi(data_producto_query)
            const producto = data_producto[0]

            //agregar producto a la base de datos
            const insertar_producto_Query = `INSERT INTO tbldetallepedidos (
                intIdPedDetalle,
                intIdPedido,
                strIdProducto,
                strDescripcion,
                intCantidad,
                strUnidadMedida,
                strObservacion,
                intPrecio,
                intPrecioProducto,
                intEstado
            )VALUES(
                ?,?,?,?,?,?,?,?,?,?
            )`;


            await obtenerDatosDb_Dash(insertar_producto_Query, [
                nuevoIdDetalle,
                idPedido,
                producto.StrIdProducto,
                producto.StrDescripcion,
                1,
                producto.StrUnidad,
                "",
                producto.precio,
                producto.precio,
                1
            ]);

            resolve({
                nuevoIdDetalle,
                idPedido,
                referencia:producto.StrIdProducto,
                descripcion:producto.StrDescripcion,
                intCantidad:1,
                strUnidad:producto.StrUnidad,
                precio:producto.precio,
            })
            
        } catch (error) {
            reject(error)
        }
    })
}

const PutActualizarPreciosPedidoQuery = (idPedido,precio) =>{
    return new Promise(async(resolve, reject) => {
        let connection;
        try {
            const precioProducto = `intPrecio${precio}`
            const productosActualizados = []

            const query = `select intIdPedDetalle,strIdProducto,intCantidad, intPrecio from tbldetallepedidos where intIdPedido = ? and intEstado = 1`
            const Productos_pedido = await obtenerDatosDb_Dash(query,[idPedido])

            connection = await poolDash.promise().getConnection();
            await connection.beginTransaction();
            
            for (const producto of Productos_pedido) {
                const obtenerPreciosReales_Query = `select ${precioProducto} from tblproductos where strIdProducto = '${producto.strIdProducto}'`
                let obtenerPreciosReales = await obtenerDatosDB_Hgi(obtenerPreciosReales_Query)
                obtenerPreciosReales = obtenerPreciosReales[0]
                const precioReal = Object.values(obtenerPreciosReales)

                const updatePrecios_Query = `Update tbldetallepedidos set intPrecio = ? where intIdPedDetalle = ?`

                if(producto.intPrecio !== precioReal[0]){
                    await obtenerDatosDb_Dash_transaccion(connection,updatePrecios_Query,[precioReal[0],producto.intIdPedDetalle])
                    productosActualizados.push({
                        intPrecio:precioReal[0],
                        intCantidad:producto.intCantidad
                    })
                }else{
                    productosActualizados.push({
                        intPrecio:producto.intPrecio,
                        intCantidad:producto.intCantidad
                    })
                }
            }
            
            let total_pedido = 0;

            for (const producto of productosActualizados) {
                total_pedido += (producto.intPrecio * producto.intCantidad)
            }

            const actualizarTotalPedido_Query = `update tblpedidos set intValorTotal = ? where intIdPedido = ?`
            await obtenerDatosDb_Dash_transaccion(connection,actualizarTotalPedido_Query,[total_pedido,idPedido])

            await connection.commit();
            resolve(total_pedido)
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            reject(error)
        } finally {
            if (connection) {
                connection.release();
            }
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
    PutEstadoPedido_Query,
    PutEstadoProductoPedido_query,
    PostProductoPedido_query,
    PutActualizarPreciosPedidoQuery
}