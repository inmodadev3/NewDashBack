const Portafolio = {}

Portafolio.ConsultaDeDatosPrincipalesClientes = () => {
    return `SELECT T.StrIdTercero,T.StrNombre as Nombre_tercero, E.StrDescripcion as Estado,T.StrDato1 as Viaja, C.StrDescripcion as ciudad,B.StrDescripcion as barrio,
    TT.intPrecio as precio,
    (SELECT TOP 1 DatFecha
    FROM TblDocumentos
    WHERE StrTercero = T.StrIdTercero
    AND (IntTransaccion = '041' OR IntTransaccion = 47)
    ORDER BY DatFecha DESC) AS ultima_Compra
    FROM TblTerceros AS T
    INNER JOIN TblEstados AS E ON T.IntTEstado = E.intIdEstado
    INNER JOIN TblCiudades AS C ON C.StrIdCiudad = T.StrCiudad
	INNER JOIN TblBarrios AS B on B.StrIdBarrio = T.StrBarrio
    INNER JOIN TblTiposTercero AS TT ON TT.IntIdTipoTercero = T.IntTipoTercero
    `
}

Portafolio.ContarTerceros = () => {
    return `select COUNT(*) as total FROM TblTerceros AS T 
    INNER JOIN TblEstados AS E ON T.IntTEstado = E.intIdEstado 
    INNER JOIN TblCiudades AS C ON C.StrIdCiudad = T.StrCiudad`
}

Portafolio.ObtenerCiudades = () => {
    return `select distinct c.intIdCiudad from dash.tblvendedores as v
    inner join dash.tblvendedoreszonas as vz on v.strCedula = vz.strIdVendedor
    inner join dash.tblciudadeszonas as c on c.intIdZona = vz.intIdZona
    where v.strCedula = ?`
}

Portafolio.UltimaGestion = () => {
    return `select dtFechaGestion from dash.tblgestiondestapemadrinatercero where strIdTercero = ? order by intIdGestion desc LIMIT 1`
}

Portafolio.Gestiones = () => {
    return `select g.intIdGestion,g.intTipoGestion, l.strNombreEmpleado,g.strObservacion,g.dtFechaGestion from dash.tblgestiondestapemadrinatercero as g
    inner join dash.tbllogin as  l on g.intIdLogin = l.idLogin
    where strIdTercero = ? order by dtFechaGestion desc`
}

Portafolio.DatosCliente = (id, anio, mes) => {
    return `select top 15 t.StrTipoId as tipoId, t.StrIdTercero as idTercero,t.StrNombre as nombre,
    t.strNombreComercial as nomCcial, t.strDireccion as direcc1,t.strdireccion2 as direcc2,t.StrTelefono as tel,
    t.strcelular as cel ,t.StrFax as tel2,t.intPlazo, tes.StrDescripcion as estado, 
    tc.StrDescripcion as ciudad, t.strMailFE as emailFE, t.intCupo as cupo, tp1.StrDescripcion as flete, 
    tp2.StrDescripcion as descuento, tt.intprecio as precioTercero, tt.strdescripcion as descTipoTercero,
    (select intsaldof from QryCarteraTercero where StrTercero = t.StrIdTercero and IntAno = ${anio} and IntPeriodo = ${mes}) as cartera,strDato0 as observacion
    from TblTerceros as t
    inner join TblTerParametro1 as tp1 on tp1.StrIdParametro = t.StrParametro1
    inner join TblTerParametro2 as tp2 on tp2.StrIdParametro = t.StrParametro2
    inner join TblEstados as tes on tes.IntIdEstado = t.IntTEstado
    inner join TblCiudades as tc on tc.StrIdCiudad = t.StrCiudad
    inner join TblTiposTercero as tt on tt.IntIdTipoTercero = t.IntTipoTercero
    where t.StrIdTercero = '${id}'`
}

Portafolio.DatosGraficosCliente = (id) => {
    return `SELECT tc.StrDescripcion, SUM(tdet.IntCantidad) as TotalCantidad
    FROM tbldocumentos as tdoc
    INNER JOIN TblDetalleDocumentos as tdet ON tdet.IntDocumento = tdoc.IntDocumento and tdet.IntTransaccion = tdoc.IntTransaccion
    INNER JOIN TblProductos as tp ON tdet.StrProducto = tp.StrIdProducto
    INNER JOIN TblClases as tc ON tc.StrIdClase = tp.StrClase
    WHERE tdoc.strTercero = '${id}'
    AND tdoc.IntTransaccion IN ('041', '47')
    AND tdet.StrProducto != '0'
    AND tc.StrIdClase IN ('1001', '101', '1011', '1021', '1031', '971', '981', '991')
    GROUP BY tc.StrDescripcion;`
}

Portafolio.Cartera = (id) => {
    return `select intSaldoF as IntTotal from Cartera WHERE StrIdTercero = '${id}'  order by IntEdadDoc ASC`
}

Portafolio.NuevaGestion = () => {
    return `INSERT INTO tblgestiondestapemadrinatercero (intTipoGestion,intIdLogin,strIdTercero,dtFechaGestion,intEstado,strObservacion) VALUES (?,?,?,?,?,?)`
}

Portafolio.CiudadesVendedor = (ciudades) => {
    return `select StrDescripcion,StrIdCiudad from TblCiudades AS C where C.StrIdCiudad in (${ciudades})`
}

Portafolio.ContactosCliente = (StrIdTercero) => {
    return `SELECT 
    TC.StrTercero,
    TC.StrNombres,
    TC.StrApellidos,
    TP.StrDescripcion as pago,
    TPR.Strnombre as compra ,
    TC.strTelefono
    FROM 
    TblContactos as TC
    LEFT JOIN 
    TblParentesco as TP ON TC.StrParentesco = TP.StrIdParentesco
    LEFT JOIN 
    TblProfesiones as TPR ON TC.StrProfesion = TPR.IntIdProfesion
    WHERE 
    TC.StrTercero = '${StrIdTercero}'`
}

Portafolio.ActualizarObservacionGeneral = (observacion, strIdCliente) => {
    return `update TblTerceros SET strDato0 = '${observacion}' where StrIdTercero = '${strIdCliente}'`
}

Portafolio.HistorialPedidosDash = () => {
    return `select intIdPedido,intValorTotal,dtFechaEnvio from tblpedidos where strIdCliente = ? order by intIdPedido desc limit 20;`
}

Portafolio.HistorialPedidosFacturadosHgi = (strIdCliente) => {
    return `select TOP 3 TRANC.StrDescripcion, IntDocumento,DatFecha, IntTotal from TblDocumentos DOC
            inner join TblTransacciones TRANC on DOC.IntTransaccion = TRANC.IntIdTransaccion
            where StrTercero = '${strIdCliente}' and IntTransaccion in ('47', '041') order by DatFecha desc
    `
}

module.exports = Portafolio