const { obtenerDatosDB_Hgi, obtenerDatosDb_Dash } = require('./Global_Querys')

const ObtenerCiudades_Query = async (vendedorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sqlDash = `select distinct c.intIdCiudad from dash.tblvendedores as v
                        inner join dash.tblvendedoreszonas as vz on v.strCedula = vz.strIdVendedor
                        inner join dash.tblciudadeszonas as c on c.intIdZona = vz.intIdZona
                        where v.strCedula = ?`

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

const GetClientes_Query = async (vendedorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ciudadesString = await ObtenerCiudades_Query(vendedorId)

            const sqlHgi = `SELECT top 100 T.StrIdTercero,T.StrNombre as Nombre_tercero, E.StrDescripcion as Estado,T.StrDato1 as Viaja, C.StrDescripcion as ciudad,
            (SELECT TOP 1 DatFecha
                        FROM TblDocumentos
                        WHERE StrTercero = T.StrIdTercero
                            AND (IntTransaccion = '041' OR IntTransaccion = 47)
                        ORDER BY DatFecha DESC) AS ultima_Compra
            FROM TblTerceros AS T
            INNER JOIN TblEstados AS E ON T.IntTEstado = E.intIdEstado
            INNER JOIN TblCiudades AS C ON C.StrIdCiudad = T.StrCiudad
            where C.StrIdCiudad in (${ciudadesString}) and T.StrIdTercero not in ('0','01211','0128','0130') and t.intTipoTercero in ('01','02','03','04','05','09',17) order by E.StrDescripcion`

            if (ciudadesString) {
                const ObtenerClientesXCiudades = await obtenerDatosDB_Hgi(sqlHgi)

                if (ObtenerClientesXCiudades !== 0) {
                    resolve(ObtenerClientesXCiudades)
                } else {
                    resolve(null)
                }
            }else{
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

            const sqlHgi = `SELECT top 100 T.StrIdTercero,T.StrNombre as Nombre_tercero, E.StrDescripcion as Estado,T.StrDato1 as Viaja, C.StrDescripcion as ciudad,
                        (SELECT TOP 1 DatFecha
                        FROM TblDocumentos
                        WHERE StrTercero = T.StrIdTercero
                            AND (IntTransaccion = '041' OR IntTransaccion = 47)
                        ORDER BY DatFecha DESC) AS ultima_Compra
                        FROM TblTerceros AS T
                        INNER JOIN TblEstados AS E ON T.IntTEstado = E.intIdEstado
                        INNER JOIN TblCiudades AS C ON C.StrIdCiudad = T.StrCiudad
                        where C.StrIdCiudad in (${ciudadesString}) and T.strIdTercero = '${clienteId}' and t.intTipoTercero in ('01','02','03','04','05','09',17) order by E.StrDescripcion`

            const ObtenerClientesXCiudades = await obtenerDatosDB_Hgi(sqlHgi)

            if (ObtenerClientesXCiudades !== 0) {
                resolve(ObtenerClientesXCiudades)
            } else {
                resolve(null)
            }

        } catch (error) {
            reject(error)
        }
    })

}

const GetClienteXNombre_Query = async (clienteNombre, vendedorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const ciudadesString = await ObtenerCiudades_Query(vendedorId)
            const sqlHgi = `SELECT top 100 T.StrIdTercero,T.StrNombre as Nombre_tercero, E.StrDescripcion as Estado,T.StrDato1 as Viaja, C.StrDescripcion as ciudad,
                        (SELECT TOP 1 DatFecha
                        FROM TblDocumentos
                        WHERE StrTercero = T.StrIdTercero
                            AND (IntTransaccion = '041' OR IntTransaccion = 47)
                        ORDER BY DatFecha DESC) AS ultima_Compra
                        FROM TblTerceros AS T
                        INNER JOIN TblEstados AS E ON T.IntTEstado = E.intIdEstado
                        INNER JOIN TblCiudades AS C ON C.StrIdCiudad = T.StrCiudad
                        where C.StrIdCiudad in (${ciudadesString}) and T.strNombre like '%${clienteNombre}%' and T.StrIdTercero not in ('0','01211','0128','0130') and t.intTipoTercero in ('01','02','03','04','05','09',17) order by E.StrDescripcion`

            const ObtenerClientesXCiudades = await obtenerDatosDB_Hgi(sqlHgi)

            if (ObtenerClientesXCiudades !== 0) {
                resolve(ObtenerClientesXCiudades)
            } else {
                resolve(null)
            }
        } catch (error) {
            reject(error)
        }
    })
}

const GetGestionesXCliente_Query = async (idTercero) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select g.intIdGestion,g.intTipoGestion, l.strNombreEmpleado,g.strObservacion,g.dtFechaGestion from dash.tblgestiondestapemadrinatercero as g
                            inner join dash.tbllogin as  l on g.intIdLogin = l.idLogin
                            where strIdTercero = ? order by dtFechaGestion desc`

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

            let sql = `select top 15 t.StrTipoId as tipoId, t.StrIdTercero as idTercero,t.StrNombre as nombre,
            t.strNombreComercial as nomCcial, t.strDireccion as direcc1,t.strdireccion2 as direcc2,t.StrTelefono as tel,
             t.strcelular as cel ,t.StrFax as tel2,t.intPlazo, tes.StrDescripcion as estado, 
             tc.StrDescripcion as ciudad, t.strMailFE as emailFE, t.intCupo as cupo, tp1.StrDescripcion as flete, 
             tp2.StrDescripcion as descuento, tt.intprecio as precioTercero, tt.strdescripcion as descTipoTercero,
            (select intsaldof from QryCarteraTercero 
                where StrTercero = t.StrIdTercero and IntAno = ${year} and IntPeriodo = ${month}) as cartera
            from TblTerceros as t
                inner join TblTerParametro1 as tp1 on tp1.StrIdParametro = t.StrParametro1
                inner join TblTerParametro2 as tp2 on tp2.StrIdParametro = t.StrParametro2
                inner join TblEstados as tes on tes.IntIdEstado = t.IntTEstado
                inner join TblCiudades as tc on tc.StrIdCiudad = t.StrCiudad
				inner join TblTiposTercero as tt on tt.IntIdTipoTercero = t.IntTipoTercero
                where t.StrIdTercero = '${id}'`;

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
            let sql = `SELECT tc.StrDescripcion, SUM(tdet.IntCantidad) as TotalCantidad
            FROM tbldocumentos as tdoc
            INNER JOIN TblDetalleDocumentos as tdet ON tdet.IntDocumento = tdoc.IntDocumento and tdet.IntTransaccion = tdoc.IntTransaccion
            INNER JOIN TblProductos as tp ON tdet.StrProducto = tp.StrIdProducto
            INNER JOIN TblClases as tc ON tc.StrIdClase = tp.StrClase
            WHERE tdoc.strTercero = '${id}'
              AND tdoc.IntTransaccion IN ('041', '47')
              AND tdet.StrProducto != '0'
              AND tc.StrIdClase IN ('1001', '101', '1011', '1021', '1031', '971', '981', '991')
            GROUP BY tc.StrDescripcion;`

            const dataGrafica = await obtenerDatosDB_Hgi(sql)
            resolve(dataGrafica)
        } catch (error) {
            reject(error)
        }
    })
}

const GetDataClientes_dataProductosMasComprados_Query = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let sql = `SELECT TOP 8 tdet.StrProducto, SUM(tdet.IntCantidad) as cantidades
                        FROM tbldocumentos as tdoc
                        INNER JOIN TblDetalleDocumentos as tdet ON tdet.IntDocumento = tdoc.IntDocumento and tdet.IntTransaccion = tdoc.IntTransaccion
                        WHERE tdoc.strTercero = '${id}'
                            AND tdoc.IntTransaccion IN ('041', '47', '46')
                            AND tdet.StrProducto != '0'
                        GROUP BY tdet.StrProducto order by cantidades desc;`

            const dataComprados = await obtenerDatosDB_Hgi(sql)
            resolve(dataComprados)
        } catch (error) {
            reject(error)
        }
    })
}

const PostNuevaGestion_Query = async (clienteId, intTipoGestion, intIdLogin, strObservacion) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fecha = new Date()
            const fechaFormated = fecha.toISOString()
            const sql = "INSERT INTO tblgestiondestapemadrinatercero (intTipoGestion,intIdLogin,strIdTercero,dtFechaGestion,intEstado,strObservacion) VALUES (?,?,?,?,?,?)"

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
            const SqlHGI = `select StrDescripcion,StrIdCiudad from TblCiudades AS C where C.StrIdCiudad in (${ciudadesString})`
            const data = await obtenerDatosDB_Hgi(SqlHGI)

            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const obtenerClientesXCiudad_Query = async (ciudadId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sqlHgi = `SELECT T.StrIdTercero,T.StrNombre as Nombre_tercero, E.StrDescripcion as Estado,T.StrDato1 as Viaja, C.StrDescripcion as ciudad,
                            (SELECT TOP 1 DatFecha
                            FROM TblDocumentos
                            WHERE StrTercero = T.StrIdTercero
                                AND (IntTransaccion = '041' OR IntTransaccion = 47)
                            ORDER BY DatFecha DESC) AS ultima_Compra
                            FROM TblTerceros AS T
                            INNER JOIN TblEstados AS E ON T.IntTEstado = E.intIdEstado
                            INNER JOIN TblCiudades AS C ON C.StrIdCiudad = T.StrCiudad
                            where C.StrIdCiudad = '${ciudadId}' and T.StrIdTercero not in ('0','01211','0128','0130') and t.intTipoTercero in ('01','02','03','04','05','09',17) order by E.StrDescripcion`

            const ClientesxCiudad = obtenerDatosDB_Hgi(sqlHgi)
            resolve(ClientesxCiudad)
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
    GetDataClientes_dataProductosMasComprados_Query,
    PostNuevaGestion_Query,
    obtenerCiudadesClientes_Query,
    obtenerClientesXCiudad_Query
}