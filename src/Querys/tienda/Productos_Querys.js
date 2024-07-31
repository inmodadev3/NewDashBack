const { obtenerDatosDB_Hgi } = require('../Global_Querys')
const descripciones = require('../../utils/Descripciones')
const { levenshteinDistance } = require('../../helpers/helpers')
const Filtro = require('../../utils/Filtro')
const ProductosTienda = require('../../Models/tienda/Productos')

const datosPrinciaplesProductos = `StrIdProducto, P.StrDescripcion, P.strLinea AS linea, Strauxiliar, StrUnidad,
IntPrecio1,IntPrecio2,IntPrecio3,IntPrecio4,IntPrecio5,
IntPrecio6,IntPrecio7, IntPrecio8, 
(SELECT I1.StrArchivo 
FROM TblImagenes AS I1 
WHERE I1.StrIdCodigo = P.StrIdProducto 
AND I1.IntOrden = 1) AS StrArchivo ,
(SELECT I2.StrArchivo 
FROM TblImagenes AS I2 
WHERE I2.StrIdCodigo = P.StrIdProducto 
AND I2.IntOrden = 2) AS ImagenOrden2, 
DatFechaIProdHab,DatFechaFProdHab,DatFechaFProdNuevo`

const GetProductosPrincipal = (instruccion_adicional, skipReg, cantidadReg, filtro = 'recent') => {

    const orden = Filtro(filtro)

    const query = `SELECT ${datosPrinciaplesProductos}
    FROM TblProductos AS P
    INNER JOIN TblImagenes AS I ON P.StrIdProducto = I.StrIdCodigo
    WHERE IntHabilitarProd = 1
    ${instruccion_adicional}
    AND I.IntOrden = 1
    ORDER BY ${orden}
    OFFSET ${skipReg} ROWS
    FETCH NEXT ${cantidadReg} ROWS ONLY`

    return query
}

const GetProductos_Query = async (clase, skipReg, cantidadReg, filtro) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query;

            if (clase) {
                query = GetProductosPrincipal(`and P.StrClase = ${clase}`, skipReg, cantidadReg, filtro)
            } else {
                query = GetProductosPrincipal('', skipReg, cantidadReg, filtro)
            }

            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetProductosXlinea_Query = async (linea, skipReg, cantidadReg, filtro) => {
    return new Promise(async (resolve, reject) => {
        try {
            /* lineas = lineas.map((linea) => `'${linea}'`).join(', ') */
            const query = GetProductosPrincipal(`and P.strLinea = '${linea}'`, skipReg, cantidadReg, filtro)
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetProductosXGrupos_Query = async (grupos, skipReg, cantidadReg, filtro) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = GetProductosPrincipal(`AND P.StrGrupo = '${grupos.IdGrupo}' AND P.StrLinea = '${grupos.IdLinea}'`, skipReg, cantidadReg, filtro)
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetProductosXTipos_Query = async (tipos, skipReg, cantidadReg, filtro) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = GetProductosPrincipal(`AND P.strTipo = '${tipos.IdTipo}' AND P.StrGrupo = '${tipos.IdGrupo}' AND P.StrLinea = '${tipos.IdLinea}'`, skipReg, cantidadReg, filtro)
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetProductoXid_Query = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select P.StrIdProducto,P.StrDescripcion,P.Strauxiliar,P.StrUnidad,P.IntPrecio1,P.IntPrecio2,
            P.IntPrecio3,P.IntPrecio4,IntPrecio7, IntPrecio8,P.StrParam3,P2.StrDescripcion as material,P.StrDescripcionCorta , 
            P.IntControl as CantPaca, P.StrParam5 as Color
            from TblProductos as P inner join TblProdParametro2 as P2 on P2.StrIdPParametro = P.StrPParametro2  where StrIdProducto = '${id}'`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetImagesXid_Query = async (referencia) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select strArchivo from TblImagenes where StrIdCodigo = '${referencia}' and IntOrden != 0 and StrArchivo != ''`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const ContarProductos_Query = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `	select COUNT(*) as totalColumna from(select StrIdProducto from TblProductos as p INNER JOIN TblImagenes AS I ON P.StrIdProducto = I.StrIdCodigo WHERE IntHabilitarProd = 1 AND I.IntOrden = 1 ) as subconsulta`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data[0])
        } catch (error) {
            reject(error)
        }
    })
}

const ContarProductosXClase_Query = async (clase) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select COUNT(*) as totalColumna from(select * from TblProductos where StrClase = '${clase}' AND TblProductos.IntHabilitarProd = 1) as subconsulta`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data[0])
        } catch (error) {
            reject(error)
        }
    })
}

const ContarProductosXLineas_Query = async (linea) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT COUNT(*) AS total FROM TblProductos WHERE strLinea = '${linea}' AND IntHabilitarProd = 1`;
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data[0])
        } catch (error) {
            reject(error)
        }
    })
}

const ContarProductosXGrupos_Query = async (grupos) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT COUNT(*) AS total FROM TblProductos WHERE StrGrupo = '${grupos.IdGrupo}' AND StrLinea = '${grupos.IdLinea}' AND IntHabilitarProd = 1`;
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data[0])
        } catch (error) {
            reject(error)
        }
    })
}

const ContarProductosXTipos_Query = async (tipos) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT COUNT(*) AS total FROM TblProductos WHERE strTipo = '${tipos.IdTipo}' AND StrGrupo = '${tipos.IdGrupo}' AND StrLinea = '${tipos.IdLinea}' AND IntHabilitarProd = 1`;
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data[0])
        } catch (error) {
            reject(error)
        }
    })
}

const Buscar_Productos_Query = async (text, skipReg, cantidadReg, filtro) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query_extra = `and (P.strIdproducto like '%${text}%' or P.StrDescripcion like '%${text}%')`
            const query = GetProductosPrincipal(query_extra, skipReg, cantidadReg, filtro)
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const Contar_Productos_Busqueda_Query = (text) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select COUNT(*) as totalColumna from(select StrIdProducto,P.StrDescripcion, I.StrArchivo ,P.intPrecio1,P.intPrecio2,P.intPrecio3,P.intPrecio4,IntPrecio7, IntPrecio8
                from TblProductos as P
                inner join TblImagenes as I on P.StrIdProducto = I.StrIdCodigo
                where IntHabilitarProd = 1
                and I.IntOrden = 1
                and (P.strIdproducto like '%${text}%' or P.StrDescripcion like '%${text}%')) as subconsulta`

            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(err)
        }
    })
}

const BuscarProductosSimilares_Query = async (text) => {
    return new Promise(async (resolve, reject) => {
        try {


            const buscador_coincidencias = (umbral) => {
                const coincidencias = []
                for (const palabraBD of descripciones) {
                    const palabrasBD = palabraBD.split(" ");
                    for (const palabraEnBD of palabrasBD) {
                        const distancia = levenshteinDistance(text.toLowerCase(), palabraEnBD.toLowerCase());
                        if (distancia <= umbral) {
                            coincidencias.push(palabraBD);
                            break;
                        }
                    }
                }

                return coincidencias
            }

            const coincidencias = buscador_coincidencias(2);
            let coincidencias_exactas = [];

            if (coincidencias.length > 15) {
                coincidencias_exactas = buscador_coincidencias(1)
            }

            const descripciones_busqueda = coincidencias_exactas.length > 0 ? coincidencias_exactas[0].split(" ")[0] : coincidencias[0].split(" ")[0]
            resolve(descripciones_busqueda)
        } catch (error) {
            reject(error)
        }
    })
}

const ObtenerRecomendaciones_Query = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = ProductosTienda.RecomendacionesxProducto(datosPrinciaplesProductos, id)
            const productos = await obtenerDatosDB_Hgi(query)
            resolve(productos)
        } catch (error) {
            reject(`${error}`)
        }
    })
}

const ProductoMasVendidosUltimoMes_Query = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = ProductosTienda.MasVendidos()
            const productos = await obtenerDatosDB_Hgi(query)
            resolve(productos)
        } catch (error) {
            reject(`${error}`)
        }
    })
}

module.exports = {
    GetProductos_Query,
    GetProductosXlinea_Query,
    GetProductosXGrupos_Query,
    GetProductosXTipos_Query,
    GetProductoXid_Query,
    GetImagesXid_Query,
    ContarProductosXClase_Query,
    ContarProductosXLineas_Query,
    ContarProductosXGrupos_Query,
    ContarProductos_Query,
    ContarProductosXTipos_Query,
    Buscar_Productos_Query,
    Contar_Productos_Busqueda_Query,
    BuscarProductosSimilares_Query,
    ObtenerRecomendaciones_Query,
    ProductoMasVendidosUltimoMes_Query
}