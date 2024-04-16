const Pedidos = require('../Models/v1/Pedidos_Model')
const poolDash = require('../databases/DashConexion')
const { obtenerDatosDB_Hgi, obtenerDatosDb_Dash, obtenerDatosDb_Dash_transaccion } = require('./Global_Querys')

const GetPedidos_Query = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = Pedidos.GetPedidos()
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
            const query = Pedidos.GetUbicaciones(strIdProducto)
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
            const query = Pedidos.InfoPedido.Body();
            const queryCabecera = Pedidos.InfoPedido.Header();

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

            const observacionTerceroQuery = Pedidos.InfoPedido.Footer(header[0].strIdCliente)
            const observacionTercero = await obtenerDatosDB_Hgi(observacionTerceroQuery)

            header[0] = { ...header[0], observacionTercero: observacionTercero[0].observacion }

            resolve({ data: array_productos, header })
        } catch (error) {
            reject(error)
        }
    })
}

const ValidarPrecios_PDF = (productoId, producto_Precio_Actual, terceroId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query_Precio = Pedidos.ValidarPreciosPDF.PrecioTercero(terceroId)

            const IntPrecio = await obtenerDatosDB_Hgi(query_Precio);
            if (IntPrecio.length > 0) {
                if ((IntPrecio[0].IntPrecio).toString() !== '0') {
                    const obtenerPrecioProducto_query = Pedidos.ValidarPreciosPDF.PrecioProducto(IntPrecio[0].IntPrecio, productoId)
                    const Precio_Producto = await obtenerDatosDB_Hgi(obtenerPrecioProducto_query)
                    const objeto = Precio_Producto[0];
                    let valor;
                    for (const propiedad in objeto) {
                        if (objeto.hasOwnProperty(propiedad)) {
                            valor = objeto[propiedad];
                            break;
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
            let condicional = "TP.intIdPedido"

            if (isNaN(Number(id))) {
                condicional = "TP.strNombCliente"
            }
            const query = Pedidos.BuscarPedido(condicional, id)
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
            const query = Pedidos.CambiarEstado()
            await obtenerDatosDb_Dash(query, [estado, id])
            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

const PutTotalPrecioPedido_Query = async (id, total) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = Pedidos.CambiarPrecioTotal()
            await obtenerDatosDb_Dash(query, [total, id])
            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

const PutEstadoProductoPedido_query = async (id, valor, valor_total, tipo, pedidoId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let variable_actualizar = "intEstado"
            if (tipo == 1) {
                variable_actualizar = "intEstado"
            } else {
                variable_actualizar = "intCantidad"
            }

            const query = `UPDATE tbldetallepedidos SET ${variable_actualizar} = ?  where intIdPedDetalle = ?`
            await obtenerDatosDb_Dash(query, [valor, id])
            await PutTotalPrecioPedido_Query(pedidoId, valor_total)
            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

const PostProductoPedido_query = async (idCliente, idProducto, idPedido) => {
    return new Promise(async (resolve, reject) => {
        try {
            //obtener el ultimo id de la tabla tbldetallepedidos
            const ultimoId_query = `SELECT COALESCE((SELECT MAX(intIdPedDetalle) FROM dash.tbldetallepedidos), 0) as ultimoID`;
            const lastIdDet = await obtenerDatosDb_Dash(ultimoId_query);
            const nuevoIdDetalle = lastIdDet[0].ultimoID + 1;

            //obtener el precio del cliente
            const obtener_precioProducto_query = `select TTT.IntPrecio as tipo_precio from TblTerceros as TT
            inner join TblTiposTercero as TTT on TT.IntTipoTercero = TTT.IntIdTipoTercero
            where TT.StrIdTercero = '${idCliente}'`
            let obtener_precioProducto = await obtenerDatosDB_Hgi(obtener_precioProducto_query)

            //obtener los datos del producto
            const data_producto_query = `select StrIdProducto, StrDescripcion,StrUnidad,IntPrecio${obtener_precioProducto[0].tipo_precio !== 0 ? obtener_precioProducto[0].tipo_precio : 1} as precio from TblProductos
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
                referencia: producto.StrIdProducto,
                descripcion: producto.StrDescripcion,
                intCantidad: 1,
                strUnidad: producto.StrUnidad,
                precio: producto.precio,
            })

        } catch (error) {
            reject(error)
        }
    })
}

const PutActualizarPreciosPedidoQuery = (idPedido, precio) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            const precioProducto = `intPrecio${precio}`
            const productosActualizados = []

            const query = `select intIdPedDetalle,strIdProducto,intCantidad, intPrecio from tbldetallepedidos where intIdPedido = ? and intEstado = 1`
            const Productos_pedido = await obtenerDatosDb_Dash(query, [idPedido])

            connection = await poolDash.promise().getConnection();
            await connection.beginTransaction();

            for (const producto of Productos_pedido) {
                const obtenerPreciosReales_Query = `select ${precioProducto} from tblproductos where strIdProducto = '${producto.strIdProducto}'`
                let obtenerPreciosReales = await obtenerDatosDB_Hgi(obtenerPreciosReales_Query)
                obtenerPreciosReales = obtenerPreciosReales[0]
                const precioReal = Object.values(obtenerPreciosReales)

                const updatePrecios_Query = `Update tbldetallepedidos set intPrecio = ? where intIdPedDetalle = ?`

                if (producto.intPrecio !== precioReal[0]) {
                    await obtenerDatosDb_Dash_transaccion(connection, updatePrecios_Query, [precioReal[0], producto.intIdPedDetalle])
                    productosActualizados.push({
                        intPrecio: precioReal[0],
                        intCantidad: producto.intCantidad
                    })
                } else {
                    productosActualizados.push({
                        intPrecio: producto.intPrecio,
                        intCantidad: producto.intCantidad
                    })
                }
            }

            let total_pedido = 0;

            for (const producto of productosActualizados) {
                total_pedido += (producto.intPrecio * producto.intCantidad)
            }

            const actualizarTotalPedido_Query = `update tblpedidos set intValorTotal = ? where intIdPedido = ?`
            await obtenerDatosDb_Dash_transaccion(connection, actualizarTotalPedido_Query, [total_pedido, idPedido])

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

const ConsultarEncargados_Query = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = Pedidos.Encargados.Consultar()
            const encargados = await obtenerDatosDb_Dash(query)
            resolve(encargados)
        } catch (error) {
            reject(error)
        }
    })
}

const obtenerDatosSeguimiento_Query = (idPedido) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tablaSeguimientos_Query = Pedidos.SeguimientoPedido.InformacionSeguimientoDash()
            const tablaSeguimientos = await obtenerDatosDb_Dash(tablaSeguimientos_Query, [idPedido])

            const tablaDocumentosHgi_Query = Pedidos.SeguimientoPedido.InformacionFacturaPedidoHGI(idPedido)
            const tablaDocumentosHgi = await obtenerDatosDB_Hgi(tablaDocumentosHgi_Query)

            let objectInfoSeguimientos = {
                NroPedido: idPedido,
                Cliente: null,
                Pago: null,
                Ciudad: null,
                Vendedor: null,
                TipoVenta: null,
                Encargado_Alistamiento1: 0,
                Encargado_Alistamiento2: 0,
                Encargado_Alistamiento3: 0,
                Encargado_Revision: 0,
                Encargado_Facturacion: 0,
                NroFactura: null,
                TipoEnvio: null,
                NroGuia: null,
                Despacho: null,
                ValorEnvio: null,
                NroCajas: null,
                Comentarios: null,
                Fecha_Facura: null,
                Fecha_Pedido: null,
                Fecha_Envio: null,
                isDropi: false,
                Devolucion: false,
                Recaudo: null,
                Estado: false,
                Cartera: false
            }

            if (tablaSeguimientos.length > 0) {
                objectInfoSeguimientos.NroPedido = tablaSeguimientos[0].intIdPedido
                objectInfoSeguimientos.Cliente = tablaSeguimientos[0].cliente
                objectInfoSeguimientos.Pago = tablaSeguimientos[0].Pago
                objectInfoSeguimientos.Ciudad = tablaSeguimientos[0].Ciudad
                objectInfoSeguimientos.Vendedor = tablaSeguimientos[0].Vendedor
                objectInfoSeguimientos.TipoVenta = tablaSeguimientos[0].TipoVenta
                objectInfoSeguimientos.Encargado_Alistamiento1 = tablaSeguimientos[0].id_encargado
                objectInfoSeguimientos.Encargado_Alistamiento2 = tablaSeguimientos[0].id_encargado2
                objectInfoSeguimientos.Encargado_Alistamiento3 = tablaSeguimientos[0].id_encargado3
                objectInfoSeguimientos.Encargado_Revision = tablaSeguimientos[0].id_encargadoRevision
                objectInfoSeguimientos.Encargado_Facturacion = tablaSeguimientos[0].id_encargadoFacturacion
                objectInfoSeguimientos.NroFactura = tablaSeguimientos[0].NroFactura
                objectInfoSeguimientos.TipoEnvio = tablaSeguimientos[0].TipoEnvio
                objectInfoSeguimientos.NroGuia = tablaSeguimientos[0].NroGuia
                objectInfoSeguimientos.Despacho = tablaSeguimientos[0].Despacho
                objectInfoSeguimientos.ValorEnvio = tablaSeguimientos[0].ValorEnvio
                objectInfoSeguimientos.NroCajas = tablaSeguimientos[0].NroCajas
                objectInfoSeguimientos.Comentarios = tablaSeguimientos[0].Comentarios
                objectInfoSeguimientos.Fecha_Facura = tablaSeguimientos[0].Fecha_Facura
                objectInfoSeguimientos.Fecha_Pedido = tablaSeguimientos[0].Fecha_Pedido
                objectInfoSeguimientos.Fecha_Envio = tablaSeguimientos[0].Fecha_Envio
                objectInfoSeguimientos.isDropi = tablaSeguimientos[0].isDropi
                objectInfoSeguimientos.Devolucion = tablaSeguimientos[0].Devolucion
                objectInfoSeguimientos.Recaudo = tablaSeguimientos[0].Recaudo
                objectInfoSeguimientos.Estado = tablaSeguimientos[0].estado
                objectInfoSeguimientos.Cartera = tablaSeguimientos[0].Cartera
            } else {
                const tablaPedidoQuery = Pedidos.SeguimientoPedido.InformacionBasicaPedido()
                const tablaPedido = await obtenerDatosDb_Dash(tablaPedidoQuery, [idPedido])

                const pagoCliente_Query = Pedidos.SeguimientoPedido.CreditoCliente(tablaPedido[0].strIdCliente)


                if (tablaPedido.length > 0) {
                    const pagoCliente = await obtenerDatosDB_Hgi(pagoCliente_Query)
                    objectInfoSeguimientos.Cliente = tablaPedido[0].strNombCliente
                    objectInfoSeguimientos.Ciudad = tablaPedido[0].strCiudadCliente
                    objectInfoSeguimientos.Fecha_Pedido = tablaPedido[0].dtFechaEnvio
                    objectInfoSeguimientos.Vendedor = tablaPedido[0].strNombvendedor
                    objectInfoSeguimientos.Pago = pagoCliente[0].IntCupo == '0' ? "Contado" : "Credito"
                } else {
                    reject("No se ha encontrado ningun pedido")
                }
            }

            if (tablaDocumentosHgi.length > 0) {
                objectInfoSeguimientos.Fecha_Facura = tablaDocumentosHgi[0].DatFecha
                objectInfoSeguimientos.NroFactura = tablaDocumentosHgi[0].intDocumento
            }

            resolve(objectInfoSeguimientos)
        } catch (error) {
            reject(error)
        }
    })
}

const AgregarDatosSeguimiento_Query = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            const {
                NroPedido,
                Cliente,
                Pago,
                Ciudad,
                Vendedor,
                TipoVenta,
                Encargado_Alistamiento1,
                Encargado_Alistamiento2,
                Encargado_Alistamiento3,
                Encargado_Revision,
                Encargado_Facturacion,
                NroFactura,
                TipoEnvio,
                NroGuia,
                Despacho,
                ValorEnvio,
                NroCajas,
                Comentarios,
                Fecha_Facura,
                Fecha_Pedido,
                Fecha_Envio,
                isDropi,
                Devolucion,
                Recaudo,
                Estado,
                Cartera,
            } = data
            const consultar_seguimientoActivo = Pedidos.SeguimientoPedido.InformacionSeguimientoDash()
            const seguimiento = await obtenerDatosDb_Dash(consultar_seguimientoActivo, [parseInt(NroPedido)])

            if (seguimiento.length == 0) {
                const IngresarSeguimiento = Pedidos.SeguimientoPedido.CrearSeguimiento()
                await obtenerDatosDb_Dash(IngresarSeguimiento, [
                    parseInt(NroPedido),
                    (Encargado_Alistamiento1 !== 0 && Encargado_Alistamiento1 !== null) ? parseInt(Encargado_Alistamiento1) : null,
                    Pago,
                    Ciudad,
                    Vendedor,
                    TipoVenta,
                    (NroFactura !== null && NroFactura !== "") ? parseInt(NroFactura) : null,
                    TipoEnvio,
                    (NroGuia !== null && NroGuia !== "") ? parseInt(NroGuia) : null,
                    Despacho,
                    ValorEnvio,
                    NroCajas,
                    Comentarios,
                    Fecha_Facura,
                    Fecha_Pedido,
                    Fecha_Envio,
                    isDropi,
                    Devolucion,
                    Recaudo,
                    Estado,
                    Cliente,
                    (Encargado_Alistamiento2 !== 0 && Encargado_Alistamiento2 !== null) ? parseInt(Encargado_Alistamiento2) : null,
                    (Encargado_Alistamiento3 !== 0 && Encargado_Alistamiento3 !== null) ? parseInt(Encargado_Alistamiento3) : null,
                    (Encargado_Facturacion !== 0 && Encargado_Facturacion !== null) ? parseInt(Encargado_Facturacion) : null,
                    (Encargado_Revision !== 0 && Encargado_Revision !== null) ? parseInt(Encargado_Revision) : null,
                    Cartera])
            } else {
                const actualizar = Pedidos.SeguimientoPedido.ActulizarSeguimiento()
                await obtenerDatosDb_Dash(actualizar, [
                    (NroFactura !== null && NroFactura !== "") ? parseInt(NroFactura) : null,
                    Cliente,
                    Vendedor,
                    Ciudad,
                    Pago,
                    TipoVenta,
                    (Encargado_Alistamiento1 !== 0 && Encargado_Alistamiento1 !== null) ? parseInt(Encargado_Alistamiento1) : null,
                    (Encargado_Alistamiento2 !== 0 && Encargado_Alistamiento2 !== null) ? parseInt(Encargado_Alistamiento2) : null,
                    (Encargado_Alistamiento3 !== 0 && Encargado_Alistamiento3 !== null) ? parseInt(Encargado_Alistamiento3) : null,
                    (Encargado_Revision !== 0 && Encargado_Revision !== null) ? parseInt(Encargado_Revision) : null,
                    (Encargado_Facturacion !== 0 && Encargado_Facturacion !== null) ? parseInt(Encargado_Facturacion) : null,
                    TipoEnvio,
                    (NroGuia !== null && NroGuia !== "") ? parseInt(NroGuia) : null,
                    Despacho,
                    ValorEnvio,
                    NroCajas,
                    Comentarios,
                    Fecha_Facura,
                    Fecha_Pedido,
                    Fecha_Envio,
                    isDropi,
                    Devolucion,
                    Recaudo,
                    Estado,
                    Cartera,
                    parseInt(NroPedido)
                ])
            }

            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}

const ObtenerSeguimientos_Query = () =>{
    return new Promise(async(resolve, reject) => {
        try {
            const query = Pedidos.Seguimientos();
            const seguimientos = await obtenerDatosDb_Dash(query);
            resolve(seguimientos)
        } catch (error) {
            reject(error)
        }
    })
}

const CrearEncargado_Query = (nombre,rol) =>{
    return new Promise(async(resolve, reject) => {
        try {
            const query = Pedidos.Encargados.Agregar()
            await obtenerDatosDb_Dash(query,[nombre,rol,1])
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
    PutEstadoPedido_Query,
    PutEstadoProductoPedido_query,
    PostProductoPedido_query,
    PutActualizarPreciosPedidoQuery,
    ConsultarEncargados_Query,
    obtenerDatosSeguimiento_Query,
    AgregarDatosSeguimiento_Query,
    ObtenerSeguimientos_Query,
    CrearEncargado_Query
}