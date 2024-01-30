const DASH = require('../databases/DashConexion').dashConexion
const HGI = require('../databases/HgiConexion').HgiConexion

const poolDash = require('../databases/DashConexion')
const { obtenerDatosDb_Dash, obtenerDatosDB_Hgi, obtenerDatosDb_Dash_transaccion } = require('./Global_Querys')


const GetProductosContenedorEstado_Query = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `Select detalle.intIdDetalle as id,detalle.strReferencia,detalle.strDescripcion,detalle.strUnidadMedida,detalle.intValor , doc.strRaggi as raggi
                            from tbldocumentocompradetalle as detalle 
                            inner join tbldocumentos as doc on detalle.intIdDocumento = doc.intIdDocumentoReferencia
                            where detalle.intEstado = 1`

            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const PostDataProductoContenedor_Dash_Query = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select * from tbldocumentocompradetalle where intIdDetalle = ?`
            const data = await obtenerDatosDb_Dash(query, [id])
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const PostDataProductoContenedor_Hgi_Query = async (referencia) => {
    return new Promise(async (resolve, reject) => {
        try {
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

            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const PostPreciosEmpresa_Query = async (precio1) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select * from tblpreciosempresa where intUDM = 1 and intPrecio1 = ?`
            const data = await obtenerDatosDb_Dash(query, [precio1])
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetProductosLiquidados_Query = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `Select detalle.intIdDetalle as id,detalle.strReferencia,detalle.strDescripcion,detalle.intPrecio1,detalle.intPrecio2,detalle.intPrecio3,detalle.intPrecio4, doc.strRaggi as raggi,detalle.strUnidadMedidaM as strUnidadMedida
                            from tbldocumentocompradetalle as detalle 
                            inner join tbldocumentos as doc on detalle.intIdDocumento = doc.intIdDocumentoReferencia
                            where detalle.intEstado = 2`

            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }

    })
}

const Post_Liquidar_Query = async (
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
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `CALL SP_ActualizarRefDetalleCompra(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
            const data = await obtenerDatosDb_Dash(query, [intIdDetalle, strDescripcion, intPrecioUno, intPrecioDos, intPrecioTres, intPrecioCuatro, intPrecioCinco, strReferencia, intCantidad, strUDM, intEstado, strDimension, intCxU, strUnidadMedida, intCantidadPaca, strMaterial, strObservacion, strSexo, strMarca, strColor])
            resolve(data)
        } catch (error) {
            reject(err)
        }

    })
}

const ACTUALIZAR_ESTADO_PRODUCTOS = async (estado, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `update tbldocumentocompradetalle set intEstado = ? where intIdDetalle = ?`

            let data = await obtenerDatosDb_Dash(query, [estado, id])
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const CargarDetallesContenedor_Query = async (raggi, importacion, fecha, total) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sql = `INSERT INTO tbldocumentos (strRaggi,strImportacion,intTRM,intOTM,intOTMUSD,intOTMSUP,intArancel,intArancelUSD,intArancelSUP,intIVA,intIVAUSD,intIVASUP,intDescargues,intDescarguesUSD,intDescarguesSUP,intDepositoFranca
                ,intDepositoFrancaUSD,intDepositoFrancaSUP,intNaviera,intNavieraUSD,intNavieraSUP,intTIC,intTICUSD,intTICSUP,intOtrosUno,intOtrosUnoUSD,intOtrosUnoSUP,intOtrosDos,intOtrosDosUSD,intOtrosDosSUP,datFecha,intPorcentajeDescuento,idEstado,intValorTotalCompra) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

            await obtenerDatosDb_Dash(sql, [raggi, importacion, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, fecha, 100, 5, total])

            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

const CargarDetallesContenedorDatos_Query = async (datos) => {
    let connection;

    try {
        connection = await poolDash.promise().getConnection();
        await connection.beginTransaction();

        const sqlDetalle = `CALL SP_AgregarDocumentoDetalleCompra(?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        for (const item of datos) {
            let itemValues = Object.values(item);
            const stringNumero = (itemValues[5].toFixed(2));
            const valorParseado = parseFloat(stringNumero);
            const referencia = itemValues[1];
            const descripcion = itemValues[2];
            const cantidad = itemValues[3];
            const udm = itemValues[4];
            const color = itemValues[6];
            const dimension = itemValues[7];
            const cxu = itemValues[8];
            const cantidad_Paca = itemValues[10];
            const material = itemValues[11];

            await obtenerDatosDb_Dash_transaccion(connection, sqlDetalle, ["", referencia, cantidad, udm, valorParseado, descripcion, 1, color, cxu, dimension, "", cantidad_Paca, material]);
        }

        await connection.commit();
        return 1;
    } catch (error) {
        console.error(error)
        if (connection) {
            await connection.rollback();
        }
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

const Obtener_Compras_Query = async () => {
    return new Promise(async(resolve, reject) => {
        try {
            const query_obtener_compras = `select intIdDocumentoReferencia,strRaggi,strImportacion from tbldocumentos`
            const data = await obtenerDatosDb_Dash(query_obtener_compras)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const Obtener_productos_compra_query = async (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const query_obtener_productos = `select * from tbldocumentocompradetalle where intIdDocumento = ?`
            const data = await obtenerDatosDb_Dash(query_obtener_productos,[id])
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}



const COMPRAS = {
    POSTDOCUMENTOS: `INSERT INTO tbldocumentos (strRaggi,strImportacion,intTRM,intOTM,intOTMUSD,intOTMSUP,intArancel,intArancelUSD,intArancelSUP,intIVA,intIVAUSD,intIVASUP,intDescargues,intDescarguesUSD,intDescarguesSUP,intDepositoFranca
        ,intDepositoFrancaUSD,intDepositoFrancaSUP,intNaviera,intNavieraUSD,intNavieraSUP,intTIC,intTICUSD,intTICSUP,intOtrosUno,intOtrosUnoUSD,intOtrosUnoSUP,intOtrosDos,intOtrosDosUSD,intOtrosDosSUP,datFecha,intPorcentajeDescuento,idEstado,intValorTotalCompra) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

    POSTDETALLEDOCUMENTOS: `CALL SP_AgregarDocumentoDetalleCompra(?,?,?,?,?,?,?,?,?,?,?,?,?)`
}


module.exports = {
    COMPRAS,
    GetProductosContenedorEstado_Query,
    PostDataProductoContenedor_Dash_Query,
    PostDataProductoContenedor_Hgi_Query,
    PostPreciosEmpresa_Query,
    Post_Liquidar_Query,
    GetProductosLiquidados_Query,
    ACTUALIZAR_ESTADO_PRODUCTOS,
    CargarDetallesContenedor_Query,
    CargarDetallesContenedorDatos_Query,
    Obtener_Compras_Query,
    Obtener_productos_compra_query
}