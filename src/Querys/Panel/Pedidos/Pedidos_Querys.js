const axios = require('axios')
const Pedidos = require('../../../Models/v1/Pedidos/Pedidos_Model')
const poolDash = require('../../../databases/DashConexion')
const { obtenerDatosDB_Hgi, obtenerDatosDb_Dash, obtenerDatosDb_Dash_transaccion } = require('../../Global_Querys')

const TransaccionHgi = 47;

const GetPedidos_Query = async (anio, mes) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Ajusta el cálculo del mes y el año
            const nextMonth = parseInt(mes) === 12 ? 1 : parseInt(mes) + 1;
            const nextYear = parseInt(mes) === 12 ? parseInt(anio) + 1 : anio;

            const fechaInicial = `${anio}-${mes.padStart(2, '0')}-01`;
            const fechaFinal = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`;

            const query = Pedidos.GetPedidos()
            const data = await obtenerDatosDb_Dash(query, [fechaInicial, fechaFinal])
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

                const ValidarPrecio = await ValidarPrecios_PDF(producto.strIdProducto, producto.intPrecio, header[0].strIdCliente, producto.strUnidadMedida)
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

            if (observacionTercero.length > 0) {
                header[0] = { ...header[0], observacionTercero: observacionTercero[0].observacion }
            } else {
                header[0] = { ...header[0], observacionTercero: '' }
            }


            resolve({ data: array_productos, header })
        } catch (error) {
            reject(error)
        }
    })
}

const ValidarPrecios_PDF = (productoId, producto_Precio_Actual, terceroId, udm) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query_Precio = Pedidos.ValidarPreciosPDF.PrecioTercero(terceroId)

            const IntPrecio = await obtenerDatosDB_Hgi(query_Precio);
            if (IntPrecio.length > 0) {
                if ((IntPrecio[0].IntPrecio).toString() !== '0') {
                    const obtenerPrecioProducto_query = Pedidos.ValidarPreciosPDF.PrecioProducto(IntPrecio[0].IntPrecio, productoId, udm)
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
            let pedidoHGI = [];


            if (isNaN(Number(id))) {
                condicional = "TP.strNombCliente"
            } else {
                let dataHGI_Query = Pedidos.BuscarPedidoHGI(id)
                const dataHGI = await obtenerDatosDB_Hgi(dataHGI_Query)

                if (dataHGI.length > 0) {
                    const idHGI = dataHGI[0].IntDocRef
                    const query = Pedidos.BuscarPedido(condicional, idHGI)
                    const data = await obtenerDatosDb_Dash(query)
                    pedidoHGI.push(data[0])
                }
            }

            const query = Pedidos.BuscarPedido(condicional, id)
            const data = await obtenerDatosDb_Dash(query)
            pedidoHGI.push(...data)
            resolve(pedidoHGI)
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
            const response = await obtenerDatosDb_Dash(query, [valor, id]);

            if (response) {
                const query_Total = 'select SUM(intCantidad * intPrecio) as Total from dash.tbldetallepedidos where intIdPedido = ? and intEstado != -1'
                const total = await obtenerDatosDb_Dash(query_Total, [pedidoId]);
                if (total) {
                    await PutTotalPrecioPedido_Query(pedidoId, total[0].Total)
                    resolve(total[0].Total)
                } else {
                    reject('Error: No se pudo calcular el total del pedido.')
                }
            } else {
                reject('Error:No se pudo actualizar el producto')
            }
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
            let precioProducto;

            if (obtener_precioProducto.length > 0) {
                precioProducto = obtener_precioProducto[0].tipo_precio !== 0 ? obtener_precioProducto[0].tipo_precio : 1;
            } else {
                const precioTiendaQuery = Pedidos.PrecioTienda()
                const PrecioTienda = await obtenerDatosDb_Dash(precioTiendaQuery, [idPedido])
                if (PrecioTienda.length > 0) {
                    precioProducto = (PrecioTienda[0].blEspera !== 0 && PrecioTienda[0].blEspera !== null) ? PrecioTienda[0].blEspera : 4
                } else {
                    precioProducto = 4
                }
            }
            //obtener los datos del producto
            const data_producto_query = `select StrIdProducto, StrDescripcion,StrUnidad,IntPrecio${precioProducto} as precio from TblProductos
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


            const response = await obtenerDatosDb_Dash(insertar_producto_Query, [
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

            if (response) {
                const query_Total = 'select SUM(intCantidad * intPrecio) as Total from dash.tbldetallepedidos where intIdPedido = ? and intEstado != -1'
                const total = await obtenerDatosDb_Dash(query_Total, [idPedido]);
                if (total) {
                    await PutTotalPrecioPedido_Query(idPedido, total[0].Total)
                    resolve({
                        nuevoIdDetalle,
                        idPedido,
                        referencia: producto.StrIdProducto,
                        descripcion: producto.StrDescripcion,
                        intCantidad: 1,
                        strUnidad: producto.StrUnidad,
                        precio: producto.precio,
                        totalPedido: total[0].Total
                    })
                } else {
                    reject('Error: No se pudo calcular el total del pedido.')
                }
            } else {
                reject('Error:No se pudo agregar el producto')
            }



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

const GetReporteDropiPendientes_Query = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = Pedidos.ReportesDropiPendientes();
            const response = await obtenerDatosDb_Dash(query)
            if (response) {
                resolve(response)
            } else {
                reject('No se han podido obtener.')
            }
        } catch (error) {
            reject(error)
        }
    })
}

const GetReportesDropi_Query = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = Pedidos.ReportesDropi(params)
            const pedidos = await obtenerDatosDb_Dash(query)
            resolve(pedidos)
        } catch (error) {
            reject(error)
        }
    })
}

const GetReportesDropiCartera_Query = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const obtenerDropiSinPagar = Pedidos.CarteraDropi()
            const pedidos = await obtenerDatosDb_Dash(obtenerDropiSinPagar)
            resolve(pedidos)
        } catch (error) {
            reject((error))
        }
    })
}

const enviarPedidoHgi_Query = (idPedido) => {
    return new Promise(async (resolve, reject) => {
        try {

            //CREAR QUERYS PARA OBTENER INFORMACION DEL PEDIDO Y DE LOS PRODUTOS

            //OBTENER PRODUCTOS DEL PEDIDO QUERY
            const productosPedidoQuery = `SELECT 
            strIdProducto,
            intCantidad,
            strUnidadMedida,
            intPrecio from tbldetallepedidos
            WHERE intIdPedido = ? and intEstado != -1 `

            //OBTENER DETALLES DEL PEDIDO QUERY
            const informacionPedidoQuery = 'select strIdCliente,strIdVendedor from dash.tblpedidos where intIdPedido = ?'

            //OBTENER VALORES DEL PEDIDO DEL DASH
            const productosPedido = await obtenerDatosDb_Dash(productosPedidoQuery, [idPedido])
            const informacionPedido = await obtenerDatosDb_Dash(informacionPedidoQuery, [idPedido])

            //VALIDAR QUE LA CEDULA SEA VALIDA O PONERLO COMO CONSUMIDOR FINAL
            let cedula = informacionPedido[0].strIdCliente
            const listTerceros = ['0', '128', '130', '123111', '123112', '1231166', '12313', '12314', '12345', '5249659', '9', '900180739', '900989883', '99', '999', '9999', '99999']

            const verdadero = listTerceros.includes(cedula)

            if (verdadero) {
                cedula = '222222222222'
            }


            //INICIALIZAR CONSTRUCION DE CONSULTA PARA TRANSACCION
            let productosQueryTransaccion = ''
            let index = 1


            //obtener consecutivo
            const consecutivo = await obtenerConsecutivoHgi()

            //CREAR ENCABEZADO
            const pedido = crearCabeceraPedidoHgi(cedula, informacionPedido[0].strIdVendedor, consecutivo, idPedido)

            //CREAR DETALLE
            for (const producto of productosPedido) {
                const nuevoProducto = crearCuerpoDetallePedidoHgi(producto.intCantidad, producto.strIdProducto, producto.strUnidadMedida, producto.intPrecio, index, consecutivo)
                productosQueryTransaccion += nuevoProducto;
                index += 1;
                productosQueryTransaccion += '\n'
            }

            //CREAR  TRANSACCION

            const queryTransaccion = `
                BEGIN TRY
                    BEGIN TRANSACTION
                        ${pedido}
                        DISABLE TRIGGER TgHgiNet_TblDetalleDocumentos ON TblDetalleDocumentos; 
                        ${productosQueryTransaccion}
                        COMMIT TRANSACTION;
                END TRY
                BEGIN CATCH
                    ROLLBACK TRANSACTION;
                    PRINT 'Ocurrio un error en la transaccion: ' + ERROR_MESSAGE();
                END CATCH

            `

            //EJECUTAR TRANSACCION
            await obtenerDatosDB_Hgi(queryTransaccion)


            //DEVOLVER CONSECUTIVO CREADO
            resolve(consecutivo)
        } catch (error) {
            reject(error)
        }
    })
}

const enviarPedidosMultiplesHgi_Query = (arrPedido) => {
    return new Promise(async (resolve, reject) => {
        try {


            //OBTENER PRODUCTOS DEL ARRAY DE PEDIDOS QUERY
            const productosPedidoQuery = `SELECT 
            strIdProducto,
            intCantidad,
            strUnidadMedida,
            intPrecio from tbldetallepedidos
            WHERE intIdPedido in (?) and intEstado != -1 `

            //OBTENER DETALLES DEL PEDIDO QUERY
            const informacionPedidoQuery = 'select strIdVendedor from dash.tblpedidos where intIdPedido = ?'

            //OBTENER VALORES DEL PEDIDO DEL DASH
            const productosPedido = await obtenerDatosDb_Dash(productosPedidoQuery, [arrPedido])
            const informacionPedido = await obtenerDatosDb_Dash(informacionPedidoQuery, [arrPedido[0]])
            let vendedor = informacionPedido[0].strIdVendedor
            let cedula = '222222222222'

            //INICIALIZAR CONSTRUCION DE CONSULTA PARA TRANSACCION
            let productosQueryTransaccion = ''
            let index = 1

            //obtener consecutivo
            const consecutivo = await obtenerConsecutivoHgi()

            //CREAR ENCABEZADO
            const pedido = crearCabeceraPedidoHgi(cedula, vendedor, consecutivo, arrPedido[0])

            //CREAR DETALLE
            for (const producto of productosPedido) {
                const nuevoProducto = crearCuerpoDetallePedidoHgi(producto.intCantidad, producto.strIdProducto, producto.strUnidadMedida, producto.intPrecio, index, consecutivo)
                productosQueryTransaccion += nuevoProducto;
                index += 1;
                productosQueryTransaccion += '\n'
            }

            //CREAR  TRANSACCION

            const queryTransaccion = `
                BEGIN TRY
                    BEGIN TRANSACTION
                        ${pedido}
                        DISABLE TRIGGER TgHgiNet_TblDetalleDocumentos ON TblDetalleDocumentos; 
                        ${productosQueryTransaccion}
                        COMMIT TRANSACTION;
                END TRY
                BEGIN CATCH
                    ROLLBACK TRANSACTION;
                    PRINT 'Ocurrio un error en la transaccion: ' + ERROR_MESSAGE();
                END CATCH

            `

            //EJECUTAR TRANSACCION
            await obtenerDatosDB_Hgi(queryTransaccion)


            //DEVOLVER CONSECUTIVO CREADO
            resolve(consecutivo)

        } catch (error) {
            reject(error)
        }
    })
}

const crearCuerpoDetallePedidoHgi = (cantidad, referencia, unidad, valorProducto, indice, consecutivo) => {

    const producto = `
    insert into TblDetalleDocumentos  
    (IntEmpresa,IntTransaccion,IntDocumento,StrProducto,StrLote,StrTalla,StrColor,IntBodega, 
    StrSerie,StrSerie1,StrSerie2,StrSerie3,IntCantidadDoc,IntCantidad,StrUnidad,IntFactor,IntValorUnitario,IntValorTotal,IntValorDescuento,
    IntValorIva,IntVrImpuesto1,IntValorCosto,IntValorUnitarioW,IntDocRefD,
    IntCostoAgregado,IntReteFte,IntSaldoI,IntVUSaldoI,IntSaldoF,IntVUSaldoF,DatFecha1,DatFecha2,StrSucursal,StrCCosto,StrSubCCosto,StrDescripcion1,StrTercero,
    StrVinculado,StrVendedor,IntTipo,IntImpresion,IntPorDescuento)  
    values('01','${TransaccionHgi}',${consecutivo},'${referencia}',0,0,'0','01',${indice},'0','0','0',${cantidad},${cantidad},
    '${unidad}',1,${valorProducto},${valorProducto * cantidad},0,0,0,0,0,0,0,0,0,0,0,0,NULL,NULL,'0','0','0',NULL,'0','0','0',0,0,0);`
    return producto
}

const crearCabeceraPedidoHgi = (terceroId, vendedorId, consecutivo, docRef) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const query = `
        ALTER TABLE TBLDOCUMENTOS DISABLE TRIGGER ALL;
        INSERT INTO [dbo].[TblDocumentos]
            ([IntEmpresa]
            ,[IntTransaccion]
            ,[IntDocumento]
            ,[IntAno]
            ,[IntPeriodo]
            ,[IntAnoCartera]
            ,[IntPeriodoCartera]
            ,[DatFecha]
            ,[DatVencimiento]
            ,[StrTercero]
            ,[IntVinculado]
            ,[StrTerceroAux]
            ,[StrDVendedor]
            ,[StrTransportador]
            ,[IntBodegaDes]
            ,[IntBodega]
            ,[StrClase]
            ,[StrMoneda]
            ,[StrSucursal]
            ,[StrCCosto]
            ,[StrSubCCosto]
            ,[StrProductoP]
            ,[StrLoteP]
            ,[IntCantidadP]
            ,[IntBaseP]
            ,[StrTipoEvento]
            ,[IntTranAux]
            ,[IntDocRef]
            ,[StrLocal]
            ,[StrReferencia]
            ,[StrReferencia1]
            ,[StrReferencia2]
            ,[StrReferencia3]
            ,[StrConceptoDocAdicional]
            ,[StrPlazo]
            ,[StrFormaDePagoDian]
            ,[IntTipoDoc]
            ,[IntValor]
            ,[IntSubtotal]
            ,[IntDDescuento]
            ,[IntIva]
            ,[IntVrImpuesto1]
            ,[IntFletes]
            ,[IntIntereses]
            ,[intPorIntereses]
            ,[IntOtrosCobros]
            ,[IntTotal]
            ,[IntRetFte]
            ,[IntRetCree]
            ,[IntRetIva]
            ,[IntRetIca]
            ,[IntNeto]
            ,[IntCostoAgregado]
            ,[IntPago]
            ,[IntCambio]
            ,[StrObservaciones]
            ,[StrCampo1]
            ,[IntPasoCupo]
            ,[IntControl]
            ,[IntEstado]
            ,[IntExportado]
            ,[IntGestion]
            ,[IntTotalesManual]
            ,[Impresiones]
            ,[IntActivacion]
            ,[IntPedido]
            ,[IntPorDescuento]
            ,[IntPorDescuentoFin]
            ,[IntValDescuentoFin]
            ,[DatFeclDescuentoFin]
            ,[IntInteres]
            ,[IntRegistros]
            ,[IntCartera]
            ,[IntCuotas]
            ,[IntIntervaloCuotas]
            ,[IntConceptoNotasDian]
            ,[IntTipoPuntos]
            ,[IntPuntos]
            ,[DatVencimientoPuntos]
            ,[IntSaldoPuntos]
            ,[IntPuntosPVenc]
            ,[IntCaja]
            ,[IntTurno]
            ,[IntTCantidad]
            ,[IntValor1]
            ,[IntValor2]
            ,[IntValor3]
            ,[IntValor4]
            ,[DatFecha1]
            ,[DatFecha2]
            ,[DatFecha3]
            ,[DatFecha4]
            ,[IntValorPar1]
            ,[IntValorPar2]
            ,[IntValorPar3]
            ,[IntValorPar4]
            ,[DatFechaGra]
            ,[StrUsuarioGra]
            ,[StrParametroDoc]
            ,[StrFacturaECufe]
            ,[IntCosto1])
        VALUES(
            1
            ,'${TransaccionHgi}'
            ,${consecutivo}
            ,${Number(year)}
            ,${Number(month) + 1}
            ,${Number(year)}
            ,${Number(month) + 1}
            ,GETDATE()
            ,dateadd(day, 30, GETDATE())
            ,'${terceroId}'
            ,0
            ,0
            ,'${vendedorId}'
            ,'0'
            ,0
            ,'01'
            ,'0'
            ,'01'
            ,'0'
            ,'0'
            ,'0'
            ,''
            ,0
            ,0
            ,'0'
            ,0
            ,0
            ,'${docRef}'
            ,'0'
            ,'0'
            ,'0'
            ,'0'
            ,'0'
            ,'0'
            ,'30'
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,NULL
            ,NULL
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,NULL
            ,0
            ,0
            ,1
            ,1
            ,0
            ,0
            ,0
            ,0
            ,CONVERT(DATE, GETDATE())
            ,0
            ,0
            ,'-2'
            ,0
            ,0
            ,0
            ,0
            ,0
            ,0
            ,GETDATE()
            ,GETDATE()
            ,GETDATE()
            ,GETDATE()
            ,0
            ,0
            ,0
            ,0
            ,GETDATE()
            ,'PAGINA'
            ,'0'
            ,NULL
            ,NULL);
        ALTER TABLE TBLDOCUMENTOS ENABLE TRIGGER ALL;
    `
    return query
}

const obtenerConsecutivoHgi = async () => {
    const query = `
        select 
            (Case 
                When (
                    ((select TOP 1 max(TblDocumentos.IntDocumento) from TblDocumentos where TblDocumentos.IntTransaccion=${TransaccionHgi}))is null) 
                THEN 
                    0 
                ELSE 
                    (select max(TblDocumentos.IntDocumento) from TblDocumentos where TblDocumentos.IntTransaccion=${TransaccionHgi})
                END
            )
        AS 'intDocumento'
    `
    const obtenerUltimoConsecutivo = await obtenerDatosDB_Hgi(query)
    const consecutivo = obtenerUltimoConsecutivo[0].intDocumento + 1
    return consecutivo
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
    GetReporteDropiPendientes_Query,
    GetReportesDropi_Query,
    GetReportesDropiCartera_Query,
    enviarPedidoHgi_Query,
    enviarPedidosMultiplesHgi_Query
}