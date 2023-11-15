const { obtenerDatosDB_Hgi, obtenerDatosDb_Dash } = require('./Global_Querys')
const { ObtenerCiudades_Query } = require('./Portafolios_Querys')

const GetFacturas_Query = (mes, year, strIdVendedor) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT TblTransacciones.StrDescripcion,IntDocumento,TblTerceros.StrNombre,tblDocumentos.IntValor,TblDocumentos.IntIva,TblDocumentos.IntTotal,TblDocumentos.StrDVendedor,TblVendedores.StrNombre as Vendedor,TblDocumentos.IntTransaccion FROM tbldocumentos
            INNER JOIN TblTerceros ON TblTerceros.StrIdTercero = TblDocumentos.StrTercero
            INNER JOIN TblVendedores ON TblVendedores.StrIdVendedor = TblDocumentos.StrDVendedor
            INNER JOIN TblTransacciones ON TblTransacciones.IntIdTransaccion = TblDocumentos.IntTransaccion
            WHERE IntTransaccion IN(04,47, 041) AND TblDocumentos.StrDVendedor = '${strIdVendedor}'
            and TblDocumentos.IntPeriodo = ${mes} AND Intano = ${year} And TblDocumentos.IntEstado <> 2`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetCartera_Query = (strIdVendedor) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select distinct * from Cartera WHERE IdVendedor = '${strIdVendedor}'  order by IntEdadDoc ASC`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetRecaudos_Query = (mes, year, strIdVendedor,) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fecha_inicial = new Date(year, mes - 1, 1);
            const fecha_final = new Date(year, mes, 0);
            const query = `SELECT TblDocumentos.IntDocumento,CAST(TblDocumentos.DatFecha As date) As FechaDocumento, TblDetallePagos.IntRecibo,
            CAST(TblDocPagos.DatFechaPago As date) As FechaPago, TblDocumentos.StrTercero,
            ((CAST(SUM(TblDetalleDocumentos.IntValorTotal) as float) + CAST(SUM(TblDetalleDocumentos.IntValorIva) as float)) / CAST(TblDocumentos.IntTotal as float)) As PorcentajeLinea, 
            CAST(TblDetallePagos.IntPago as Int) As TotalPago,
            TblDetallePagos.StrConcepto,TblDocumentos.IntTransaccion,TblTransacciones.StrDescripcion, TblTerceros.StrCiudad,TblTerceros.StrNombre 
            FROM TblDetallePagos
            INNER JOIN TblDocumentos ON TblDetallePagos.IntDocumento = TblDocumentos.IntDocumento 
            and TblDocumentos.intTransaccion = TblDetallePagos.intTransaccion
            INNER JOIN TblDetalleDocumentos ON TblDocumentos.IntDocumento = TblDetalleDocumentos.IntDocumento 
            AND TblDocumentos.IntTransaccion=TblDetalleDocumentos.IntTransaccion
            INNER JOIN TblVendedores ON TblDocumentos.StrDVendedor = TblVendedores.StrIdVendedor
            INNER JOIN TblTerceros ON TblDocumentos.StrTercero = TblTerceros.StrIdTercero
            INNER JOIN TblDocPagos ON TblDetallePagos.IntRecibo = TblDocPagos.IntRecibo AND TblDetallePagos.IntTipoRecibo = TblDocPagos.IntTipoRecibo
            INNER JOIN TblTransacciones ON TblDocumentos.IntTransaccion = TblTransacciones.IntIdTransaccion
            where TblDetalleDocumentos.IntTransaccion IN ('041','04','117','17','47') 
            AND TblDocumentos.IntEstado<>2
            AND TblDocPagos.DatFecha>= '${fecha_inicial.toISOString().slice(0, 10)}' AND TblDocPagos.DatFecha <= '${fecha_final.toISOString().slice(0, 10)}' AND TblDocumentos.StrDVendedor = '${strIdVendedor}'
            GROUP BY TblDocumentos.IntTransaccion,TblDocumentos.IntDocumento,  TblTerceros.StrCiudad,TblTransacciones.StrDescripcion,
            TblDetallePagos.IntRecibo,TblDocumentos.DatFecha,TblDocPagos.DatFechaPago,TblDocumentos.StrTercero,
            TblDocumentos.IntDocumento,(TblDocumentos.IntTotal),TblDetallePagos.IntPago,
            TblDetallePagos.StrConcepto,TblTerceros.StrNombre`
            const data = await obtenerDatosDB_Hgi(query)
            const array_Datos = []

            for (let i = 0; i < data.length; i++) {
                let descuento = 0;
                let total_valor_pagado = data[i].TotalPago;
                for (let j = 0; j < data.length; j++) {
                    if (data[i].StrConcepto == "01") {
                        if ((data[i].IntDocumento === data[j].IntDocumento) && (data[j].StrConcepto == "08")) {
                            total_valor_pagado = data[i].TotalPago - data[j].TotalPago
                            descuento = data[j].TotalPago
                        }
                    }
                }

                if (data[i].StrConcepto !== "08" && data[i].StrConcepto !== "14" && data[i].StrConcepto !== "36" && data[i].StrConcepto !== "24") {
                    let documento_object = {
                        Doc_pago: data[i].intRecibo,
                        Doc_Venta: data[i].IntDocumento,
                        Fecha_Doc: data[i].FechaDocumento,
                        Fecha_Recaudo: data[i].FechaPago,
                        valor: total_valor_pagado,
                        descuento: descuento,
                        tercero: data[i].StrNombre
                    }

                    array_Datos.push(documento_object)
                }
            }
            resolve(array_Datos)
        } catch (error) {
            reject(error)
        }
    })
}

const GetLiquidadas_Query = (mes, year, strIdVendedor, loginId = 119) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `CALL SP_ListarDocumentosPagadosVendedor(?,?,?,?,?)`
            const data = await obtenerDatosDb_Dash(query, [strIdVendedor, mes, year, '01', loginId])
            resolve(data[0])
        } catch (error) {
            reject(error)
        }
    })
}

const GetCarteraCiudades_Query =(strIdVendedor)=>{
    return new Promise(async(resolve, reject) => {
        try {
            let ciudades = await ObtenerCiudades_Query(strIdVendedor);
            const query = `select distinct * from Cartera WHERE StrCiudad IN (${ciudades}) order by IntEdadDoc ASC`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    GetFacturas_Query,
    GetCartera_Query,
    GetRecaudos_Query,
    GetLiquidadas_Query,
    GetCarteraCiudades_Query
}