const Terceros = {}

Terceros.Contados = (year, month) => {
    return `select top 15 t.StrTipoId as tipoId, t.StrIdTercero as idTercero,t.StrNombre as nombre,
    t.strNombreComercial as nomCcial, t.strDireccion as direcc1,t.strdireccion2 as direcc2,t.StrTelefono as tel,
    t.strcelular as cel ,t.StrFax as tel2, t.IntTipoTercero,t.intPlazo, tes.StrDescripcion as estado, 
    tc.StrDescripcion as ciudad, t.strMailFE as emailFE, t.intCupo as cupo, tp1.StrDescripcion as flete, 
    tp2.StrDescripcion as descuento,
    (select intsaldof from QryCarteraTercero 
    where StrTercero = t.StrIdTercero and IntAno = ${year} and IntPeriodo = ${month}) as cartera
    from TblTerceros as t
    inner join TblTerParametro1 as tp1 on tp1.StrIdParametro = t.StrParametro1
    inner join TblTerParametro2 as tp2 on tp2.StrIdParametro = t.StrParametro2
    inner join TblEstados as tes on tes.IntIdEstado = t.IntTEstado
    inner join TblCiudades as tc on tc.StrIdCiudad = t.StrCiudad
    where t.StrIdTercero in ('123111','123112','12313','9999','1231166','99999','222222222222') order by nombre`
}

Terceros.Id = (year, month, id) => {
    return `select top 15 t.StrTipoId as tipoId, t.StrIdTercero as idTercero,t.StrNombre as nombre,
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
    where t.StrIdTercero = '${id}'`
}

module.exports = Terceros