const Portafolio = require('../../Models/v1/Portafolios/Portafolio/Portafolio_Model');
const DeshabilitarTrigger = require('../../utils/DeshabilitarTrigger');
const { obtenerDatosDB_Hgi, obtenerDatosDb_Dash } = require('../Global_Querys')
const moment = require('moment-timezone');


const ConsultaDeDatosPrincipalesClientes = Portafolio.ConsultaDeDatosPrincipalesClientes()

const OrdenPrincipal = `E.StrDescripcion`

const contarTerceros = Portafolio.ContarTerceros()

const DatosPorPagina = 50

//OBTENER RANGO DE DATOS

const limiteOffset = (pagina) => {
    const cantidadRegistros = DatosPorPagina;
    const saltarRegistros = pagina * cantidadRegistros;

    return `OFFSET ${saltarRegistros} ROWS FETCH NEXT ${cantidadRegistros} ROWS ONLY`
}

// OBTENER LAS CIUDADES EN BASE AL DASH
const ObtenerCiudades_Query = async (vendedorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sqlDash = Portafolio.ObtenerCiudades();

            const ciudadesIdArr = []
            const ObtenerCiudades = await obtenerDatosDb_Dash(sqlDash, [vendedorId.toString()])

            for (const IdCiudad of ObtenerCiudades) {
                ciudadesIdArr.push((IdCiudad.intIdCiudad).toString())
            }

            const ciudadesString = ciudadesIdArr.map((ciudad) => `'${ciudad}'`).join(', ');
            resolve(ciudadesString)
        } catch (error) {
            reject(error)
        }
    })
}

//OBTENER LA CANTIDAD DE PAGINAS POR PORTAFOLIO
const contarPaginas = (condiciones = "") => {
    return new Promise(async (resolve, reject) => {
        try {
            const consulta = `${contarTerceros} ${condiciones}`
            const totalDatos = await obtenerDatosDB_Hgi(consulta)
            const { total } = totalDatos[0]
            let pagina = total / DatosPorPagina
            pagina = Math.ceil(pagina) - 1
            resolve(pagina)
        } catch (error) {
            reject(error)
        }
    })
}

// OBTENER ULTIMA GESTION DEL CLIENTE
const GetUltimaGestion = (arrayTerceros) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sqlUltimaGestion = Portafolio.UltimaGestion()
            const datosClientes = []
            for (const cliente of arrayTerceros) {
                const gestion = await obtenerDatosDb_Dash(sqlUltimaGestion, [cliente.StrIdTercero])
                datosClientes.push({
                    ...cliente,
                    ultima_gestion: gestion[0] ? gestion[0].dtFechaGestion : null
                })
            }
            resolve(datosClientes)
        } catch (error) {
            reject(error.message)
        }
    })

}

// FUNCIONES PARA OBTENER CLIENTES
const GetClientes_Query = async (vendedorId, pag) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ciudadesString = await ObtenerCiudades_Query(vendedorId)

            const condicionesSQL = `C.StrIdCiudad in (${ciudadesString}) and T.StrIdTercero not in ('0','01211','0128','0130') and t.intTipoTercero in ('01','02','03','04','05','09',17,18,19)`
            const pagina = limiteOffset(pag)
            const consulta = `${ConsultaDeDatosPrincipalesClientes} where ${condicionesSQL} order by ${OrdenPrincipal} ${pagina}`

            if (ciudadesString) {
                const ObtenerClientesXCiudades = await obtenerDatosDB_Hgi(consulta)
                if (ObtenerClientesXCiudades !== 0) {
                    const totalPaginas = await contarPaginas(`where ${condicionesSQL}`)
                    const datosClientes = await GetUltimaGestion(ObtenerClientesXCiudades)
                    resolve({ datosClientes, totalPaginas })
                } else {
                    resolve(null)
                }
            } else {
                reject("No se encontraron ciudades asociadas")
            }

        } catch (error) {
            reject(error)
        }
    })
}

const GetClienteXIdentificacion_Query = async (clienteId, vendedorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ciudadesString = await ObtenerCiudades_Query(vendedorId)

            const condicionesSQL = `C.StrIdCiudad in (${ciudadesString}) and T.strIdTercero = '${clienteId}' and t.intTipoTercero in ('01','02','03','04','05','09',17,18,19)`
            const consulta = `${ConsultaDeDatosPrincipalesClientes} where ${condicionesSQL} order by ${OrdenPrincipal}`

            const ObtenerClientesXCiudades = await obtenerDatosDB_Hgi(consulta)

            if (ObtenerClientesXCiudades !== 0) {

                const datosClientes = await GetUltimaGestion(ObtenerClientesXCiudades)
                resolve(datosClientes)
            } else {
                resolve(null)
            }

        } catch (error) {
            reject(error)
        }
    })

}

const GetClienteXNombre_Query = async (clienteNombre, vendedorId, pag) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ciudadesString = await ObtenerCiudades_Query(vendedorId)
            const condicionesSQL = `C.StrIdCiudad in (${ciudadesString}) and T.strNombre like '%${clienteNombre}%' and T.StrIdTercero not in ('0','01211','0128','0130') and t.intTipoTercero in ('01','02','03','04','05','09',17,18,19)`
            const pagina = limiteOffset(pag)
            const consulta = `${ConsultaDeDatosPrincipalesClientes} where ${condicionesSQL} order by ${OrdenPrincipal} ${pagina}`


            const ObtenerClientesXCiudades = await obtenerDatosDB_Hgi(consulta)
            if (ObtenerClientesXCiudades !== 0) {
                const datosClientes = await GetUltimaGestion(ObtenerClientesXCiudades)
                const totalPaginas = await contarPaginas(`where ${condicionesSQL}`)
                resolve({ datosClientes, totalPaginas })
            } else {
                resolve(null)
            }
        } catch (error) {
            reject(error)
        }
    })
}

const obtenerClientesXCiudad_Query = async (ciudadId, segmentoInt, pag) => {
    return new Promise(async (resolve, reject) => {
        try {
            let condicionesSQL = `C.StrIdCiudad = '${ciudadId}' and T.StrIdTercero not in ('0','01211','0128','0130')`;
            let opcionesAdcionales;

            if (segmentoInt.toString() !== "0") {
                opcionesAdcionales = `t.intTipoTercero = '${segmentoInt}' `
            } else {
                opcionesAdcionales = `t.intTipoTercero in ('01','02','03','04','05','09',17,18,19) `
            }
            const pagina = limiteOffset(pag)
            const consulta = `${ConsultaDeDatosPrincipalesClientes} where ${condicionesSQL} and ${opcionesAdcionales} order by ${OrdenPrincipal} ${pagina}`

            const ClientesxCiudad = await obtenerDatosDB_Hgi(consulta)
            const totalPaginas = await contarPaginas(`where ${condicionesSQL} and ${opcionesAdcionales}`)
            const datosClientes = await GetUltimaGestion(ClientesxCiudad)
            resolve({ datosClientes, totalPaginas })
        } catch (error) {
            reject(error)
        }
    })
}

// FIN DE CONSULTAS PARA OBTENER CLIENTES

const GetGestionesXCliente_Query = async (idTercero) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = Portafolio.Gestiones()
            const gestiones_Cliente = await obtenerDatosDb_Dash(query, [idTercero])
            resolve(gestiones_Cliente)
        } catch (error) {
            reject(error)
        }
    })
}

const GetDataClientes_dataClientes_Query = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fecha = new Date();
            const year = fecha.getFullYear();
            const month = fecha.getMonth() + 1;
            let sql = Portafolio.DatosCliente(id, year, month);
            let data = await obtenerDatosDB_Hgi(sql)
            resolve(data[0])
        } catch (error) {
            reject(error)
        }
    })
}

const GetDataClientes_dataGrafica_Query = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = Portafolio.DatosGraficosCliente(id)
            const dataGrafica = await obtenerDatosDB_Hgi(sql)
            resolve(dataGrafica)
        } catch (error) {
            reject(error)
        }
    })
}

const GetCarteraClienteQuery = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = Portafolio.Cartera(id)
            const dataComprados = await obtenerDatosDB_Hgi(sql)
            resolve(dataComprados.length > 0 ? dataComprados[0].IntTotal : 0)
        } catch (error) {
            reject(error)
        }
    })
}

const PostNuevaGestion_Query = async (clienteId, intTipoGestion, intIdLogin, strObservacion) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fecha = moment();
            const fechaColombia = fecha.tz('America/Bogota');
            const fechaFormated = fechaColombia.format('YYYY-MM-DD HH:mm:ss')
            const sql = Portafolio.NuevaGestion()
            const data = await obtenerDatosDb_Dash(sql, [intTipoGestion, intIdLogin, clienteId, fechaFormated, 1, strObservacion])
            resolve({ data: data, completed: true, message: "Gestion agregada con exito" })
        } catch (error) {
            reject(error)
        }
    })
}

const obtenerCiudadesClientes_Query = async (vendedorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ciudadesString = await ObtenerCiudades_Query(vendedorId)
            const SqlHGI = Portafolio.CiudadesVendedor(ciudadesString)
            const data = await obtenerDatosDB_Hgi(SqlHGI)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetContactosCliente_Query = async (StrIdTercero) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = Portafolio.ContactosCliente(StrIdTercero)
            const data = await obtenerDatosDB_Hgi(sql)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const PutObservacion_Query = (text, strIdCliente) => {
    return new Promise(async (resolve, reject) => {
        try {
            const Actualizar = Portafolio.ActualizarObservacionGeneral(text, strIdCliente)
            DeshabilitarTrigger('TblTerceros')
            await obtenerDatosDB_Hgi(Actualizar)
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}

const GetUltimoPedidoCliente = (idCliente) => {
    return new Promise(async (resolve, reject) => {
        try {
            const queryDash = Portafolio.HistorialPedidosDash()
            const idPedido = await obtenerDatosDb_Dash(queryDash, [idCliente])

            if (idPedido.length > 0) {
                resolve(idPedido)
            } else {
                resolve(null)
            }
        } catch (error) {
            reject(error)
        }
    })
}

const GetUltimosPedidosHgiFacturados_query = (idCliente) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = Portafolio.HistorialPedidosFacturadosHgi(idCliente)
            const idPedido = await obtenerDatosDB_Hgi(query)

            if (idPedido.length > 0) {
                resolve(idPedido)
            } else {
                resolve(null)
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    GetClientes_Query,
    GetClienteXIdentificacion_Query,
    GetClienteXNombre_Query,
    GetGestionesXCliente_Query,
    GetDataClientes_dataClientes_Query,
    GetDataClientes_dataGrafica_Query,
    GetCarteraClienteQuery,
    PostNuevaGestion_Query,
    obtenerCiudadesClientes_Query,
    obtenerClientesXCiudad_Query,
    ObtenerCiudades_Query,
    GetContactosCliente_Query,
    PutObservacion_Query,
    GetUltimoPedidoCliente,
    GetUltimosPedidosHgiFacturados_query
}