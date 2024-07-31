const ProductosTienda = {}

ProductosTienda.RecomendacionesxProducto = (datosPrinciaplesProductos, referencia) => {
    return `SELECT TOP 4 ${datosPrinciaplesProductos} FROM TblProductos P 
    INNER JOIN TblImagenes AS I ON P.StrIdProducto = I.StrIdCodigo
    WHERE IntHabilitarProd = 1 AND
    I.IntOrden = 1 AND 
    P.StrIdProducto != '${referencia}' AND
    (
        (StrTipo = (SELECT StrTipo FROM TblProductos WHERE StrIdProducto = '${referencia}' AND StrTipo != '0'))
        OR
        (StrGrupo = (SELECT StrGrupo FROM TblProductos WHERE StrIdProducto = '${referencia}' AND StrGrupo != '0') AND 
        (SELECT StrTipo FROM TblProductos WHERE StrIdProducto = '${referencia}' AND StrTipo != '0') IS NULL)
        OR
        (StrLinea = (SELECT StrLinea FROM TblProductos WHERE StrIdProducto = '${referencia}' AND StrLinea != '0') AND 
        (SELECT StrTipo FROM TblProductos WHERE StrIdProducto = '${referencia}' AND StrTipo != '0') IS NULL AND 
        (SELECT StrGrupo FROM TblProductos WHERE StrIdProducto = '${referencia}' AND StrGrupo != '0') IS NULL)
        OR
        (StrClase = (SELECT StrClase FROM TblProductos WHERE StrIdProducto = '${referencia}' AND StrClase != '0') AND 
        (SELECT StrTipo FROM TblProductos WHERE StrIdProducto = '${referencia}' AND StrTipo != '0') IS NULL AND 
        (SELECT StrGrupo FROM TblProductos WHERE StrIdProducto = '${referencia}' AND StrGrupo != '0') IS NULL AND 
        (SELECT StrLinea FROM TblProductos WHERE StrIdProducto = '${referencia}' AND StrLinea != '0') IS NULL)
    )
    ORDER BY  NEWID()`
}


ProductosTienda.MasVendidos = () => {
    return `
    WITH ProductosUnicos AS (
        SELECT 
            DD.StrProducto as StrIdProducto,
            P.StrDescripcion,
            P.strLinea AS linea,
            P.Strauxiliar,
            P.StrUnidad,
            IntPrecio1,
            IntPrecio2,
            IntPrecio3,
            IntPrecio4,
            IntPrecio5,
            IntPrecio6,
            IntPrecio7,
            IntPrecio8,
            (SELECT I1.StrArchivo 
            FROM TblImagenes AS I1 
            WHERE I1.StrIdCodigo = DD.StrProducto 
            AND I1.IntOrden = 1) AS StrArchivo ,
            (SELECT I2.StrArchivo 
            FROM TblImagenes AS I2 
            WHERE I2.StrIdCodigo = DD.StrProducto 
            AND I2.IntOrden = 2) AS ImagenOrden2,
            DatFechaFProdHab,
            DatFechaFProdNuevo,
            DatFechaIProdHab,
            COUNT(DD.StrProducto) AS Compras_Producto,
            ROW_NUMBER() OVER (PARTITION BY DD.StrProducto ORDER BY COUNT(DD.StrProducto) DESC) AS rn
        FROM tbldetalledocumentos DD
        INNER JOIN TblDocumentos D ON DD.IntDocumento = D.IntDocumento
        INNER JOIN TblProductos P ON P.StrIdProducto = DD.StrProducto
        INNER JOIN TblImagenes I ON P.StrIdProducto = I.StrIdCodigo
        WHERE D.DatFecha > GETDATE() - 30
        AND D.IntTransaccion = 47
        AND DD.StrProducto != '0'
        AND P.IntHabilitarProd = 1
        AND I.StrArchivo != ''
        GROUP BY 
            DD.StrProducto,
            P.StrDescripcion,
            P.strLinea,
            P.Strauxiliar,
            P.StrUnidad,
            IntPrecio1,
            IntPrecio2,
            IntPrecio3,
            IntPrecio4,
            IntPrecio5,
            IntPrecio6,
            IntPrecio7,
            IntPrecio8,
            StrArchivo,
            DatFechaFProdHab,
            DatFechaFProdNuevo,
            DatFechaIProdHab
    )
    SELECT TOP 30 *
    FROM ProductosUnicos
    WHERE rn = 1
    ORDER BY Compras_Producto DESC`
}

module.exports = ProductosTienda