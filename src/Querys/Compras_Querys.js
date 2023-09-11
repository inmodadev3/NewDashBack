const DASH = require('../databases/DashConexion').dashConexion
const HGI = require('../databases/HgiConexion').HgiConexion


const GET_PRODUCTOS_CONTENEDOR = () => {
    return new Promise((resolve, reject) => {
        const query = `Select detalle.intIdDetalle as id,detalle.strReferencia,detalle.strDescripcion,detalle.strUnidadMedida,detalle.intValor , doc.strRaggi as raggi
        from tbldocumentocompradetalle as detalle 
        inner join tbldocumentos as doc on detalle.intIdDocumento = doc.intIdDocumentoReferencia
        where detalle.intEstado = 1`

        return DASH.query(query,(err,rows)=>{
            if(err){
                reject(err)
                return;
            }
            resolve(rows)
        })
    })
}

const GET_PRODUCTO_COMPRADETALLE = (id) =>{
    return new Promise((resolve,reject)=>{
        const query = `select * from tbldocumentocompradetalle where intIdDetalle = ?`

        DASH.query(query,[id],(err,rows)=>{
            if(err){
                reject(err)
                return;
            }
            resolve(rows)
        })
    })
}

const GET_INFO_PRODUCTO_HGI = (referencia) =>{
    return new Promise((resolve,reject)=>{
        const query = `SELECT StrIdProducto as referencia, P.StrDescripcion as Descripcion, IntPrecio1 as  precio1,IntPrecio2 as  precio2,IntPrecio3 as  precio3,
        IntPrecio4 as  precio4,StrParam3 as dimension, StrUnidad as unidad_medida, PP1.StrDescripcion as genero, PP2.StrDescripcion as material,PP3.StrDescripcion as marca,
        L.StrDescripcion as linea, C.StrDescripcion as clase, G.StrDescripcion as grupo, T.StrDescripcion as tipo, P.StrDescripcionCorta as descripcion_corta
        FROM TblProductos as P
        inner join TblProdParametro1 as PP1 on P.StrPParametro1 = PP1.StrIdPParametro1
        inner join TblProdParametro2 as PP2 on P.StrPParametro2 = PP2.StrIdPParametro
        inner join TblProdParametro3 as PP3 on P.StrPParametro3 = PP3.StrIdPParametro
        inner join TblLineas as  L on P.StrLinea = L.StrIdLinea
        inner join TblClases as  C on P.StrClase = C.StrIdClase
        inner join TblGrupos as  G on P.StrGrupo = G.StrIdGrupo
        inner join TblTipos as  T on P.StrTipo = T.StrIdTipo
        where StrIdProducto = '${referencia}'`

        HGI.query(query,(err,rows)=>{
            if(err){
                reject(err)
                return;
            }

            resolve(rows.recordset)
        })
    })
}

const GET_PRECIOS_EMPRESA = (precio1) =>{
    return new Promise((resolve,reject)=>{
        const query = `select * from tblpreciosempresa where intUDM = 1 and intPrecio1 = ?`

        DASH.query(query,[precio1],(err,rows)=>{
            if(err){
                reject(err)
                return;
            }

            resolve(rows)
        })
    })
}

const GET_PRODUCTOS_LIQUIDADOS = () =>{
    return new Promise((resolve, reject) => {
        const query = `Select detalle.intIdDetalle as id,detalle.strReferencia,detalle.strDescripcion,detalle.intPrecio1,detalle.intPrecio2,detalle.intPrecio3,detalle.intPrecio4, doc.strRaggi as raggi,detalle.strUnidadMedida
        from tbldocumentocompradetalle as detalle 
        inner join tbldocumentos as doc on detalle.intIdDocumento = doc.intIdDocumentoReferencia
        where detalle.intEstado = 2`

        return DASH.query(query,(err,rows)=>{
            if(err){
                reject(err)
                return;
            }
            resolve(rows)
        })
    }) 
}

const LIQUIDAR_PRODUCTO = (
    intIdDetalle,
    strDescripcion,
    intPrecioUno,
    intPrecioDos,
    intPrecioTres,
    intPrecioCuatro,
    intPrecioCinco,
    strReferencia,
    intCantidad,
    strUDM,
    intEstado,
    strDimension,
    intCxU,
    strUnidadMedida,
    intCantidadPaca,
    strMaterial,
    strObservacion,
    strSexo,
    strMarca,
    strColor
    ) =>{
    return new Promise((resolve,reject)=>{
        const query = `CALL SP_ActualizarRefDetalleCompra(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

        DASH.query(query,[intIdDetalle,
            strDescripcion,
            intPrecioUno,
            intPrecioDos,
            intPrecioTres,
            intPrecioCuatro,
            intPrecioCinco,
            strReferencia,
            intCantidad,
            strUDM,
            intEstado,
            strDimension,
            intCxU,
            strUnidadMedida,
            intCantidadPaca,
            strMaterial,
            strObservacion,
            strSexo,
            strMarca,
            strColor],(err,rows)=>{
                if(err){
                    reject(err)
                    return;
                }

                resolve(rows)
            })
    })
}

const ACTUALIZAR_ESTADO_PRODUCTOS = (estado, id) =>{
    return new Promise((resolve,reject)=>{
        const query = `update tbldocumentocompradetalle set intEstado = ? where intIdDetalle = ?`
    
        DASH.query(query,[estado,id],(err,rows)=>{
            if(err){
                reject(err);
                return;
            }

            resolve(1)
        })
    })
}


const COMPRAS = {
    POSTDOCUMENTOS: `INSERT INTO tbldocumentos (strRaggi,strImportacion,intTRM,intOTM,intOTMUSD,intOTMSUP,intArancel,intArancelUSD,intArancelSUP,intIVA,intIVAUSD,intIVASUP,intDescargues,intDescarguesUSD,intDescarguesSUP,intDepositoFranca
        ,intDepositoFrancaUSD,intDepositoFrancaSUP,intNaviera,intNavieraUSD,intNavieraSUP,intTIC,intTICUSD,intTICSUP,intOtrosUno,intOtrosUnoUSD,intOtrosUnoSUP,intOtrosDos,intOtrosDosUSD,intOtrosDosSUP,datFecha,intPorcentajeDescuento,idEstado,intValorTotalCompra) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

    POSTDETALLEDOCUMENTOS: `CALL SP_AgregarDocumentoDetalleCompra(?,?,?,?,?,?,?,?,?,?,?,?,?)`
}


module.exports = { 
    COMPRAS, 
    GET_PRODUCTOS_CONTENEDOR,
    GET_PRODUCTO_COMPRADETALLE,
    GET_INFO_PRODUCTO_HGI,
    GET_PRECIOS_EMPRESA,
    LIQUIDAR_PRODUCTO,
    GET_PRODUCTOS_LIQUIDADOS,
    ACTUALIZAR_ESTADO_PRODUCTOS
}