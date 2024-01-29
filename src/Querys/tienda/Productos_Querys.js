const { obtenerDatosDB_Hgi } = require('../Global_Querys')

const GetProductos_Query = async (clase, skipReg, cantidadReg) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query;

            if (clase) {
                query = `select StrIdProducto,P.StrDescripcion,Strauxiliar,StrUnidad,IntPrecio1,IntPrecio2,IntPrecio3,IntPrecio4, I.StrArchivo
                        from TblProductos as P
                        inner join TblImagenes as I on P.StrIdProducto = I.StrIdCodigo
                        where IntHabilitarProd = 1
                        and P.StrClase = ${clase}
                        and I.IntOrden = 1
                        order by P.StrIdProducto
                        OFFSET ${skipReg} ROWS
                        FETCH NEXT ${cantidadReg} ROWS ONLY`
            } else {
                query = `select StrIdProducto,P.StrDescripcion,Strauxiliar,StrUnidad,IntPrecio1,IntPrecio2,IntPrecio3,IntPrecio4, I.StrArchivo
                        from TblProductos as P
                        inner join TblImagenes as I on P.StrIdProducto = I.StrIdCodigo
                        where IntHabilitarProd = 1
                        and I.IntOrden = 1
                        order by P.StrIdProducto
                        OFFSET ${skipReg} ROWS
                        FETCH NEXT ${cantidadReg} ROWS ONLY`
            }

            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetProductosXlinea_Query = async (lineas, skipReg, cantidadReg) => {
    return new Promise(async (resolve, reject) => {
        try {
            lineas = lineas.map((linea) => `'${linea}'`).join(', ')

            const query = `select StrIdProducto,P.StrDescripcion,P.strLinea as linea,Strauxiliar,StrUnidad,IntPrecio1,IntPrecio2,IntPrecio3,IntPrecio4, I.StrArchivo
                            from TblProductos as P
                            inner join TblImagenes as I on P.StrIdProducto = I.StrIdCodigo
                            where IntHabilitarProd = 1
                            and P.strLinea in (${lineas})
                            and I.IntOrden = 1
                            order by P.StrIdProducto
                            OFFSET ${skipReg} ROWS
                            FETCH NEXT ${cantidadReg} ROWS ONLY`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetProductosXGrupos_Query = async (grupos, skipReg, cantidadReg) => {
    return new Promise(async (resolve, reject) => {
        try {
            grupos = grupos.map((grupo) => `'${grupo}'`).join(', ')
            const query = `select StrIdProducto,P.StrDescripcion,P.strLinea as linea,Strauxiliar,StrUnidad,IntPrecio1,IntPrecio2,IntPrecio3,IntPrecio4, I.StrArchivo
                            from TblProductos as P
                            inner join TblImagenes as I on P.StrIdProducto = I.StrIdCodigo
                            where IntHabilitarProd = 1
                            and P.strGrupo in (${grupos})
                            and I.IntOrden = 1
                            order by P.StrIdProducto
                            OFFSET ${skipReg} ROWS
                            FETCH NEXT ${cantidadReg} ROWS ONLY`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetProductosXTipos_Query = async (tipos, skipReg, cantidadReg) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tipoGrupoConditions = tipos.map(({ IdTipo, IdGrupo }) => `(P.strTipo = '${IdTipo}' AND P.StrGrupo = '${IdGrupo}')`).join(' OR ');

            const query = `SELECT StrIdProducto, P.StrDescripcion, P.strLinea AS linea, Strauxiliar, StrUnidad, IntPrecio1, IntPrecio2, IntPrecio3, IntPrecio4, I.StrArchivo
            FROM TblProductos AS P
            INNER JOIN TblImagenes AS I ON P.StrIdProducto = I.StrIdCodigo
            WHERE IntHabilitarProd = 1
            AND (${tipoGrupoConditions})
            AND I.IntOrden = 1
            ORDER BY P.StrIdProducto
            OFFSET ${skipReg} ROWS
            FETCH NEXT ${cantidadReg} ROWS ONLY`;
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
            P.IntPrecio3,P.IntPrecio4,P.StrParam3,P2.StrDescripcion as material,P.StrDescripcionCorta , P.IntControl as CantPaca
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
            const query = `select StrIdProducto,P.StrDescripcion,Strauxiliar,StrUnidad,IntPrecio1,IntPrecio2,IntPrecio3,IntPrecio4, I.StrArchivo
            from TblProductos as P
            inner join TblImagenes as I on P.StrIdProducto = I.StrIdCodigo
            where IntHabilitarProd = 1
            and I.IntOrden = 1
            and (P.strIdproducto like '%${text}%' or P.StrDescripcion like '%${text}%')
            order by P.StrIdProducto
            OFFSET ${skipReg} ROWS
            FETCH NEXT ${cantidadReg} ROWS ONLY`

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
            const query = `select COUNT(*) as totalColumna from(select StrIdProducto,P.StrDescripcion, I.StrArchivo ,P.intPrecio1,P.intPrecio2,P.intPrecio3,P.intPrecio4
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
    Contar_Productos_Busqueda_Query
}