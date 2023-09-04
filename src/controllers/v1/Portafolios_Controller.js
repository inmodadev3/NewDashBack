const DASH = require('../../databases/DashConexion').dashConexion
const HGI = require('../../databases/HgiConexion').HgiConexion

const GetClientes = async (req, res) => {

  const { vendedorId } = req.params

  const sqlDash = `select distinct c.intIdCiudad from dash.tblvendedores as v
    inner join dash.tblvendedoreszonas as vz on v.strCedula = vz.strIdVendedor
    inner join dash.tblciudadeszonas as c on c.intIdZona = vz.intIdZona
    where v.strCedula = ?`

  try {
    const ObtenerCiudades = await new Promise((resolve, reject) => {
      DASH.query(sqlDash, [vendedorId.toString()], (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
    })

    const ciudadesIdArr = []

    for (const IdCiudad of ObtenerCiudades) {
      ciudadesIdArr.push((IdCiudad.intIdCiudad).toString())
    }

    const ciudadesString = ciudadesIdArr.map((ciudad) => `'${ciudad}'`).join(', ');

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

    const ObtenerClientesXCiudades = await new Promise((resolve, reject) => {
      if (ciudadesIdArr.length !== 0) {
        HGI.query(sqlHgi, (err, rows) => {
          if (err) reject(err)
          resolve(rows.recordset)
        })
      } else {
        resolve(null)
      }
    })
    res.status(200).json({ data: ObtenerClientesXCiudades })
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

const GetClienteXIdentificacion = async (req, res) => {

  const { clienteId, vendedorId } = req.body

  const sqlDash = `select distinct c.intIdCiudad from dash.tblvendedores as v
  inner join dash.tblvendedoreszonas as vz on v.strCedula = vz.strIdVendedor
  inner join dash.tblciudadeszonas as c on c.intIdZona = vz.intIdZona
  where v.strCedula = ?`

  try {
    const ObtenerCiudades = await new Promise((resolve, reject) => {
      DASH.query(sqlDash, [vendedorId.toString()], (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
    })

    const ciudadesIdArr = []

    for (const IdCiudad of ObtenerCiudades) {
      ciudadesIdArr.push((IdCiudad.intIdCiudad).toString())
    }

    const ciudadesString = ciudadesIdArr.map((ciudad) => `'${ciudad}'`).join(', ');

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

    const ObtenerClientesXCiudades = await new Promise((resolve, reject) => {
      if (ciudadesIdArr.length !== 0) {
        HGI.query(sqlHgi, (err, rows) => {
          if (err) reject(err)
          resolve(rows.recordset)
        })
      } else {
        resolve(null)
      }
    })
    res.status(200).json({ data: ObtenerClientesXCiudades })
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

const GetClienteXNombre = async (req, res) => {

  const { clienteNombre, vendedorId } = req.body

  const sqlDash = `select distinct c.intIdCiudad from dash.tblvendedores as v
  inner join dash.tblvendedoreszonas as vz on v.strCedula = vz.strIdVendedor
  inner join dash.tblciudadeszonas as c on c.intIdZona = vz.intIdZona
  where v.strCedula = ?`

  try {
    const ObtenerCiudades = await new Promise((resolve, reject) => {
      DASH.query(sqlDash, [vendedorId.toString()], (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
    })

    const ciudadesIdArr = []

    for (const IdCiudad of ObtenerCiudades) {
      ciudadesIdArr.push((IdCiudad.intIdCiudad).toString())
    }

    const ciudadesString = ciudadesIdArr.map((ciudad) => `'${ciudad}'`).join(', ');

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

    const ObtenerClientesXCiudades = await new Promise((resolve, reject) => {
      if (ciudadesIdArr.length !== 0) {
        HGI.query(sqlHgi, (err, rows) => {
          if (err) reject(err)
          resolve(rows.recordset)
        })
      } else {
        resolve(null)
      }
    })
    res.status(200).json({ data: ObtenerClientesXCiudades })
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

const GetGestionesXCliente = (req, res) => {
  const { id } = req.params
  const query = `select g.intIdGestion,g.intTipoGestion, l.strNombreEmpleado,g.strObservacion,g.dtFechaGestion from dash.tblgestiondestapemadrinatercero as g
  inner join dash.tbllogin as  l on g.intIdLogin = l.idLogin
  where strIdTercero = ? order by dtFechaGestion desc`

  try {
    DASH.query(query, [id.toString()], (err, rows) => {
      if (err) res.status(400).json({ error: err })

      res.status(200).json({ data: rows })
    })
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

const GetDataClientes = async (req, res) => {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = fecha.getMonth() + 1;
  const { id } = req.params

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

  let sql2 = `SELECT tc.StrDescripcion, SUM(tdet.IntCantidad) as TotalCantidad
            FROM tbldocumentos as tdoc
            INNER JOIN TblDetalleDocumentos as tdet ON tdet.IntDocumento = tdoc.IntDocumento
            INNER JOIN TblProductos as tp ON tdet.StrProducto = tp.StrIdProducto
            INNER JOIN TblClases as tc ON tc.StrIdClase = tp.StrClase
            WHERE tdoc.strTercero = '${id}'
              AND tdoc.IntTransaccion IN ('041', '47')
              AND tdet.StrProducto != '0'
              AND tc.StrIdClase IN ('1001', '101', '1011', '1021', '1031', '971', '981', '991')
            GROUP BY tc.StrDescripcion;`

  let sql3 = `SELECT TOP 8 tdet.StrProducto, SUM(tdet.IntCantidad) as cantidades
  FROM tbldocumentos as tdoc
  INNER JOIN TblDetalleDocumentos as tdet ON tdet.IntDocumento = tdoc.IntDocumento
  WHERE tdoc.strTercero = '${id}'
    AND tdoc.IntTransaccion IN ('041', '47', '46')
    AND tdet.StrProducto != '0'
  GROUP BY tdet.StrProducto order by cantidades desc;`

  let dataClientes = await new Promise((resolve, reject) => {
    HGI.query(sql, (err, rows) => {
      if (err) return reject({ error: err.name, stack: err.stack, errorMessage: err.message })
      resolve(rows.recordset[0])

    })
  })

  let dataGrafica = await new Promise((resolve, reject) => {
    HGI.query(sql2, (err, rows) => {
      if (err) return reject({ error: err.name, stack: err.stack, errorMessage: err.message })
      resolve(rows.recordset)
    })
  })

  let dataProductosMasComprados = await new Promise((resolve, reject) => {
    HGI.query(sql3, (err, rows) => {
      if (err) return reject({ error: err.name, stack: err.stack, errorMessage: err.message })
      resolve(rows.recordset)
    })
  })

  res.status(200).json({ data: dataClientes, grafica: dataGrafica, topComprados: dataProductosMasComprados })


}

const PostNuevaGestion = (req, res) => {
  const {
    clienteId,
    intTipoGestion,
    intIdLogin,
    strObservacion
  } = req.body

  const fecha = new Date()
  const fechaFormated = fecha.toISOString()

  const sql = "INSERT INTO tblgestiondestapemadrinatercero (intTipoGestion,intIdLogin,strIdTercero,dtFechaGestion,intEstado,strObservacion) VALUES (?,?,?,?,?,?)"

  DASH.query(sql, [intTipoGestion, intIdLogin, clienteId, fechaFormated, 1, strObservacion], (err, rows) => {
    if (err) return res.status(400).json({ error: err, message: err.message, stack: err.stack, completed: false })

    res.status(200).json({ data: rows, completed: true, message: "Gestion agregada con exito" })
  })
}

const obtenerCiudadesClientes = async (req, res) => {
  const { vendedorId } = req.body

  const sqlDash = `select distinct c.intIdCiudad from dash.tblvendedores as v
    inner join dash.tblvendedoreszonas as vz on v.strCedula = vz.strIdVendedor
    inner join dash.tblciudadeszonas as c on c.intIdZona = vz.intIdZona
    where v.strCedula = ?`
  try {
    const ObtenerCiudades = await new Promise((resolve, reject) => {
      DASH.query(sqlDash, [vendedorId.toString()], (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows)
      })
    })

    const ciudadesIdArr = []

    for (const IdCiudad of ObtenerCiudades) {
      ciudadesIdArr.push((IdCiudad.intIdCiudad).toString())
    }

    const ciudadesString = ciudadesIdArr.map((ciudad) => `'${ciudad}'`).join(', ');
    const SqlHGI = `select StrDescripcion,StrIdCiudad from TblCiudades AS C where C.StrIdCiudad in (${ciudadesString})`

    const obtenerCiudadesHgi = await new Promise((resolve, reject) => {
      HGI.query(SqlHGI, (err, rows) => {
        if (err) {
          reject(err)
        }
        resolve(rows.recordset)
      })
    })
    res.status(200).json({ data: obtenerCiudadesHgi })
  } catch (error) {
    res.status(400).json({ error: error })
  }
}

const obtenerClientesXCiudad = async(req,res) =>{
  const {ciudadId} = req.body

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

    HGI.query(sqlHgi,(err,rows)=>{
      if(err){
        res.status(400).json({ error: err })
        return;
      }

      res.status(200).json({data:rows.recordset})
    })
}

module.exports = {
  GetClientes,
  GetClienteXIdentificacion,
  GetClienteXNombre,
  GetGestionesXCliente,
  PostNuevaGestion,
  GetDataClientes,
  obtenerCiudadesClientes,
  obtenerClientesXCiudad
}