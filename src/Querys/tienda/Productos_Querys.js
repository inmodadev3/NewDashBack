const { obtenerDatosDB_Hgi } = require('../Global_Querys')
const descripciones = require('../../utils/Descripciones')
const { levenshteinDistance } = require('../../helpers/helpers')
const Filtro = require('../../utils/Filtro')

const datosPrinciaplesProductos = `StrIdProducto, P.StrDescripcion, P.strLinea AS linea, Strauxiliar, StrUnidad,
IntPrecio1,IntPrecio2,IntPrecio3,IntPrecio4,IntPrecio5,
IntPrecio6,IntPrecio7, IntPrecio8, I.StrArchivo , DatFechaFProdHab,DatFechaFProdNuevo`

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

const GetProductosXlinea_Query = async (lineas, skipReg, cantidadReg, filtro) => {
    return new Promise(async (resolve, reject) => {
        try {
            lineas = lineas.map((linea) => `'${linea}'`).join(', ')
            const query = GetProductosPrincipal(`and P.strLinea in (${lineas})`, skipReg, cantidadReg, filtro)
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
            const GrupoConditions = grupos.map(({ IdGrupo, IdLinea }) => `(P.StrGrupo = '${IdGrupo}'
            AND P.StrLinea = '${IdLinea}')`).join(' OR ');

            const query = GetProductosPrincipal(`AND (${GrupoConditions})`, skipReg, cantidadReg,filtro)
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
            const tipoGrupoConditions = tipos.map(({ IdTipo, IdGrupo, IdLinea }) => `(P.strTipo = '${IdTipo}' AND P.StrGrupo = '${IdGrupo}'
            AND P.StrLinea = '${IdLinea}')`).join(' OR ');
            const query = GetProductosPrincipal(`AND (${tipoGrupoConditions})`, skipReg, cantidadReg,filtro)
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
            const query = `select COUNT(*) as totalColumna from(select * from TblProductos where TblProductos.IntHabilitarProd = 1 ) as subconsulta `
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

const ContarProductosXLineas_Query = async (lineasString) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT COUNT(*) AS total FROM TblProductos WHERE strLinea IN (${lineasString}) AND IntHabilitarProd = 1`;
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data[0])
        } catch (error) {
            reject(error)
        }
    })
}

const ContarProductosXGrupos_Query = async (grusposString) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT COUNT(*) AS total FROM TblProductos WHERE strGrupo IN (${grusposString}) AND IntHabilitarProd = 1`;
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data[0])
        } catch (error) {
            reject(error)
        }
    })
}

const ContarProductosXTipos_Query = async (tiposString) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT COUNT(*) AS total FROM TblProductos WHERE StrTipo IN (${tiposString}) AND IntHabilitarProd = 1`;
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data[0])
        } catch (error) {
            reject(error)
        }
    })
}

const Buscar_Productos_Query = async (text, skipReg, cantidadReg) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query_extra = `and (P.strIdproducto like '%${text}%' or P.StrDescripcion like '%${text}%')`
            const query = GetProductosPrincipal(query_extra, skipReg, cantidadReg)
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
            /* for (const palabraBD of descripciones) {
                const palabrasBD = palabraBD.split(" ");
                for (const palabraEnBD of palabrasBD) {
                    const distancia = levenshteinDistance(text.toLowerCase(), palabraEnBD.toLowerCase());
                    if (distancia <= 2) {
                        coincidencias.push(palabraBD);
                        break;
                    }
                }
            } */

            if (coincidencias.length > 15) {
                coincidencias_exactas = buscador_coincidencias(1)
                /* for (const palabraBD of coincidencias) {
                    const palabrasBD = palabraBD.split(" ");
                    for (const palabraEnBD of palabrasBD) {
                        const distancia = levenshteinDistance(text.toLowerCase(), palabraEnBD.toLowerCase());
                        if (distancia <= 1) {
                            coincidencias_exactas.push(palabraBD);
                            break;
                        }
                    }
                } */
            }

            const descripciones_busqueda = coincidencias_exactas.length > 0 ? coincidencias_exactas[0].split(" ")[0] : coincidencias[0].split(" ")[0]
            resolve(descripciones_busqueda)
        } catch (error) {
            reject(error)
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
    BuscarProductosSimilares_Query
}