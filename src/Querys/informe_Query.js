const { obtenerDatosDB_Hgi } = require("./Global_Querys")

const Consultar_Ventas_Empleados_Query = (mes, anio) => {
    return new Promise(async(resolve, reject) => {
        try {
            const query = `select TV.StrNombre, CAST(ROUND(SUM(TD.IntTotal),0) as int) as Total from TblDocumentos as TD
            inner join TblVendedores as TV on TV.StrIdVendedor = TD.StrDVendedor
            where IntPeriodo = ${mes} and IntAno = ${anio} and IntTransaccion in ('041','47') group by TV.StrNombre order by Total desc`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}


const Consultar_Ventas_DiasdelMes_Query = (mes,anio) =>{
    return new Promise(async(resolve, reject) => {
        try {
            const query = `SELECT
            DAY(TD.DatFecha) as dia,
            CAST(ROUND(SUM(TD.IntTotal),0) as int) as suma_ventas_con_iva
        FROM
            TblDocumentos as TD
        WHERE
            TD.IntPeriodo =  ${mes} and
            TD.intAno = ${anio}  and
            TD.IntTransaccion in ('041','47')
        GROUP BY
            YEAR(TD.DatFecha), MONTH(TD.DatFecha), DAY(TD.DatFecha)
        ORDER BY
            YEAR(TD.DatFecha), MONTH(TD.DatFecha), DAY(TD.DatFecha);`

            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const Consultar_Datos_generalesMes_Query = (mes, anio) =>{
    return new Promise(async(resolve, reject) => {
        try {
            const query = `select COUNT(IntDocumento) as TotalPedidos, CAST(ROUND(SUM(IntTotal),0) as INT) as TotalValorPedidos  from TblDocumentos 
            where IntPeriodo = ${mes} and IntAno = ${anio} and IntTransaccion in ('041','47')`

            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const Consultar_Top_compradoresMes_Query = (mes,anio) =>{
    return new Promise(async(resolve, reject) => {
        try {
            const query = `select TOP 10 TERC.StrNombre, CAST(ROUND(SUM(IntTotal),0) as int) as TotalComprasTercero from TblDocumentos as TDOC
            Inner Join TblTerceros as TERC on TDOC.StrTercero = TERC.StrIdTercero
            where TDOC.IntPeriodo = ${mes} and TDOC.IntAno = ${anio} and TDOC.IntTransaccion in ('041','47')
            Group by TERC.StrNombre
            order by TotalComprasTercero desc`

            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    Consultar_Ventas_Empleados_Query,
    Consultar_Ventas_DiasdelMes_Query,
    Consultar_Datos_generalesMes_Query,
    Consultar_Top_compradoresMes_Query
}