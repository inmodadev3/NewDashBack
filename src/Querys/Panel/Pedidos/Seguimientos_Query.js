const Pedidos = require('../../../Models/v1/Pedidos/Pedidos_Model')
const Seguimientos = require('../../../Models/v1/Pedidos/Seguimientos_Model')
const { obtenerDatosDB_Hgi, obtenerDatosDb_Dash } = require('../../Global_Querys')

const ConsultarEncargados_Query = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = Seguimientos.Encargados.Consultar()
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
            const tablaSeguimientos_Query = Seguimientos.SeguimientoPedido.InformacionSeguimientoDash()
            const tablaSeguimientos = await obtenerDatosDb_Dash(tablaSeguimientos_Query, [idPedido])

            const tablaDocumentosHgi_Query = Seguimientos.SeguimientoPedido.InformacionFacturaPedidoHGI(idPedido)
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
                Cartera: false,
                PagoHGI: false
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
                objectInfoSeguimientos.PagoHGI = tablaSeguimientos[0].PagoHGI
            } else {
                const tablaPedidoQuery = Seguimientos.SeguimientoPedido.InformacionBasicaPedido()
                const tablaPedido = await obtenerDatosDb_Dash(tablaPedidoQuery, [idPedido])

                const pagoCliente_Query = Seguimientos.SeguimientoPedido.CreditoCliente(tablaPedido[0].strIdCliente)


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
                PagoHGI
            } = data
            const consultar_seguimientoActivo = Seguimientos.SeguimientoPedido.InformacionSeguimientoDash()
            let seguimiento = []

            try {
                if (NroPedido) {
                    seguimiento = await obtenerDatosDb_Dash(consultar_seguimientoActivo, [parseInt(NroPedido)])

                    if (seguimiento.length == 0) {
                        const IngresarSeguimiento = Seguimientos.SeguimientoPedido.CrearSeguimiento()
                        await obtenerDatosDb_Dash(IngresarSeguimiento, [
                            parseInt(NroPedido),
                            (Encargado_Alistamiento1 !== 0 && Encargado_Alistamiento1 !== null) ? parseInt(Encargado_Alistamiento1) : null,
                            Pago,
                            Ciudad,
                            Vendedor,
                            TipoVenta,
                            (NroFactura !== null && NroFactura !== "" && !isNaN(parseInt(NroFactura))) ? parseInt(NroFactura) : null,
                            TipoEnvio,
                            NroGuia,
                            Despacho,
                            ValorEnvio,
                            NroCajas,
                            Comentarios,
                            ((Fecha_Facura).toString() !== "" && Fecha_Facura !== null && Fecha_Facura !== NaN && typeof (Fecha_Facura) !== "string") ? Fecha_Facura : (NroFactura !== null && NroFactura !== "" && !isNaN(parseInt(NroFactura)) ? new Date().toISOString().slice(0, 10) : null),
                            Fecha_Pedido,
                            Fecha_Envio,
                            isDropi,
                            Devolucion,
                            Recaudo,
                            Estado,
                            Cliente,
                            (Encargado_Alistamiento2 !== 0 && Encargado_Alistamiento2 !== null && !isNaN(parseInt(Encargado_Alistamiento2))) ? parseInt(Encargado_Alistamiento2) : null,
                            (Encargado_Alistamiento3 !== 0 && Encargado_Alistamiento3 !== null && !isNaN(parseInt(Encargado_Alistamiento3))) ? parseInt(Encargado_Alistamiento3) : null,
                            (Encargado_Facturacion !== 0 && Encargado_Facturacion !== null && !isNaN(parseInt(Encargado_Facturacion))) ? parseInt(Encargado_Facturacion) : null,
                            (Encargado_Revision !== 0 && Encargado_Revision !== null && !isNaN(parseInt(Encargado_Revision))) ? parseInt(Encargado_Revision) : null,
                            Cartera,
                            PagoHGI
                        ])
                    } else {
                        const actualizar = Seguimientos.SeguimientoPedido.ActulizarSeguimiento()
                        await obtenerDatosDb_Dash(actualizar, [
                            (NroFactura !== null && NroFactura !== "") ? parseInt(NroFactura) : null,
                            Cliente,
                            Vendedor,
                            Ciudad,
                            Pago,
                            TipoVenta,
                            (parseInt(Encargado_Alistamiento1) !== 0 && Encargado_Alistamiento1 !== null && !isNaN(parseInt(Encargado_Alistamiento1))) ? parseInt(Encargado_Alistamiento1) : null,
                            (parseInt(Encargado_Alistamiento2) !== 0 && Encargado_Alistamiento2 !== null && !isNaN(parseInt(Encargado_Alistamiento2))) ? parseInt(Encargado_Alistamiento2) : null,
                            (parseInt(Encargado_Alistamiento3) !== 0 && Encargado_Alistamiento3 !== null && !isNaN(parseInt(Encargado_Alistamiento3))) ? parseInt(Encargado_Alistamiento3) : null,
                            (parseInt(Encargado_Revision) !== 0 && Encargado_Revision !== null && !isNaN(parseInt(Encargado_Revision))) ? parseInt(Encargado_Revision) : null,
                            (parseInt(Encargado_Facturacion) !== 0 && Encargado_Facturacion !== null && !isNaN(parseInt(Encargado_Facturacion))) ? parseInt(Encargado_Facturacion) : null,
                            TipoEnvio,
                            NroGuia,
                            Despacho,
                            ValorEnvio,
                            NroCajas,
                            Comentarios,
                            ((Fecha_Facura).toString() !== "" && Fecha_Facura !== null && Fecha_Facura !== NaN && typeof (Fecha_Facura) !== "string") ? Fecha_Facura : (NroFactura !== null && NroFactura !== "" && !isNaN(parseInt(NroFactura)) ? new Date().toISOString().slice(0, 10) : null),
                            Fecha_Pedido,
                            Fecha_Envio,
                            isDropi,
                            Devolucion,
                            Recaudo,
                            Estado,
                            Cartera,
                            PagoHGI,
                            parseInt(NroPedido)
                        ])
                    }
                    resolve(true)

                }
            } catch (error) {
                reject(error)
            }

        } catch (error) {
            reject(error)
        }
    })
}

const ObtenerSeguimientos_Query = (fecha) => {
    return new Promise(async (resolve, reject) => {
        try {
            const seguimientosArr = [];
            let seguimientosProcesados = new Set();
            const seguimientosConPagoHGI = [];

            const seguimientos = await obtenerDatosDb_Dash(Seguimientos.Seguimientos(), [fecha]);

            const intIdPedidos = seguimientos.map(seguimiento => seguimiento.intIdPedido);
            const pagosQueries = intIdPedidos.map(intIdPedido => Seguimientos.PagosHGI(intIdPedido));

            const pagosPromises = pagosQueries.map(query => obtenerDatosDB_Hgi(query));
            const pagosResults = await Promise.all(pagosPromises);
            const filteredPagosResults = pagosResults.filter(result => result.length > 0);

            filteredPagosResults.forEach((item) => {
                const intDocRef = parseInt(item[0].IntDocRef);
                const seguimientoEncontrado = seguimientos.find(seguimiento => parseInt(seguimiento.intIdPedido) === intDocRef);

                if (seguimientoEncontrado) {
                    if (!seguimientosProcesados.has(parseInt(seguimientoEncontrado.intIdPedido))) {
                        seguimientosConPagoHGI.push({ ...seguimientoEncontrado, pagoHGI: true });
                        seguimientosProcesados.add(seguimientoEncontrado.intIdPedido);
                    }
                } else {
                    console.log("No se encontró seguimiento para IntDocRef:", intDocRef);
                }
            });

            seguimientos.forEach((seguimiento) => {
                if (!seguimientosProcesados.has(seguimiento.intIdPedido)) {
                    seguimientosArr.push(seguimiento);
                    seguimientosProcesados.add(seguimiento.intIdPedido);
                }
            });

            seguimientosArr.push(...seguimientosConPagoHGI);

            resolve(seguimientosArr)
        } catch (error) {
            reject(error)
        }
    })
}

const CrearEncargado_Query = (nombre, rol) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = Seguimientos.Encargados.Agregar()
            await obtenerDatosDb_Dash(query, [nombre, rol, 1])
            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

const BuscarSeguimiento_Query = (busqueda) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = Seguimientos.Buscar();
            const parametroLike = `%${busqueda}%`
            const response = await obtenerDatosDb_Dash(query, [parametroLike, parametroLike, parametroLike, parametroLike, parametroLike])
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}

const ActualizarEncargadosSeguimientos_Query = (idEncargado1, idEncargado2, idEncargado3, idEncargadoRevision, idPedido, nroCajas) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!idPedido || idPedido == null || idPedido == undefined) {
                reject("Nro de Pedido invalido")
            }


            const query = Seguimientos.SeguimientoPedido.ActualizarEncargadosSeguimiento()
            const response = await obtenerDatosDb_Dash(query, [idEncargado1, idEncargado2, idEncargado3, idEncargadoRevision, nroCajas, idPedido])
            if (response.affectedRows == 0) {
                const query_pedido = Pedidos.InfoPedido.Header()
                const query_insertar = Seguimientos.SeguimientoPedido.CrearSeguimiento()

                const pedido = await obtenerDatosDb_Dash(query_pedido, [idPedido])
                try {
                    await obtenerDatosDb_Dash(query_insertar, [
                        idPedido,
                        idEncargado1,
                        "Contado",
                        pedido[0].strCiudadCliente,
                        pedido[0].strNombVendedor,
                        "",
                        null,
                        "",
                        "",
                        "",
                        "",
                        nroCajas,
                        "",
                        null,
                        pedido[0].dtFechaEnvio,
                        null,
                        0,
                        0,
                        "",
                        0,
                        pedido[0].strNombCliente,
                        idEncargado2,
                        idEncargado3,
                        null,
                        idEncargadoRevision,
                        0,
                        0,
                        null
                    ])
                } catch (error) {
                    reject(error)
                }
            }

            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    ConsultarEncargados_Query,
    obtenerDatosSeguimiento_Query,
    AgregarDatosSeguimiento_Query,
    ObtenerSeguimientos_Query,
    CrearEncargado_Query,
    BuscarSeguimiento_Query,
    ActualizarEncargadosSeguimientos_Query
}
