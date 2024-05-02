const Productos = {}

Productos.Id = (year, month, id) => {
    return `SELECT TOP 10 p.StrIdProducto AS referencia, p.StrDescripcion AS descripcion, 
    p.strunidad AS UM,p.strauxiliar as cantxEmpaque, p.strparam2 AS Ubicacion,  p.strparam3 AS medida, pp1.StrDescripcion AS sexo, 
    pp2.StrDescripcion AS Material,  pp3.StrDescripcion AS Marca, 
    p.intprecio1,  p.intprecio2,  p.intprecio3, p.intprecio4, I.StrArchivo, 
    (SELECT intCantidadFinal FROM qrySaldosInv 
    WHERE strProducto = p.StrIdProducto and IntAno = ${year} and IntPeriodo = ${month} and intBodega = 01) AS saldoInv
    FROM tblproductos AS p
    INNER JOIN TblImagenes AS I ON P.StrIdProducto = I.StrIdCodigo
    INNER JOIN TblProdParametro1 AS pp1 ON pp1.StrIdPParametro1 = p.StrPParametro1
    INNER JOIN TblProdParametro2 AS pp2 ON pp2.StrIdPParametro = p.StrPParametro2
    INNER JOIN TblProdParametro3 AS pp3 ON pp3.StrIdPParametro = p.StrPParametro3
    WHERE StrIdProducto = '${id}' and I.IntOrden = 1`
}

module.exports = Productos