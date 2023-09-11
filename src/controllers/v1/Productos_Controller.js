const { GET_MARCAS, GET_GENEROS, GET_UNIDADES } = require('../../Querys/Productos_Querys');

const HGI = require('../../databases/HgiConexion').HgiConexion

const GetInfoProductos = (req, res) => {
    const { strIdProducto } = req.params
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1;
    const query = `SELECT TOP 10 p.StrIdProducto AS referencia, p.StrDescripcion AS descripcion, 
    p.strunidad AS UM,p.strauxiliar as cantxEmpaque, p.strparam2 AS Ubicacion,  p.strparam3 AS medida, pp1.StrDescripcion AS sexo, 
    pp2.StrDescripcion AS Material,  pp3.StrDescripcion AS Marca, 
    p.intprecio1 as precio, 
    (SELECT strarchivo 
     FROM tblimagenes 
     WHERE stridcodigo = p.StrIdProducto AND StrDescripcion = '1') AS productoImg, 
    (SELECT intCantidadFinal 
     FROM qrySaldosInv 
     WHERE strProducto = p.StrIdProducto and IntAno = ${year} and IntPeriodo = ${month} and IntBodega = '01') AS saldoInv
    FROM tblproductos AS p
    INNER JOIN TblProdParametro1 AS pp1 ON pp1.StrIdPParametro1 = p.StrPParametro1
    INNER JOIN TblProdParametro2 AS pp2 ON pp2.StrIdPParametro = p.StrPParametro2
    INNER JOIN TblProdParametro3 AS pp3 ON pp3.StrIdPParametro = p.StrPParametro3
    WHERE StrIdProducto LIKE '${strIdProducto}%'`

    HGI.query(query, (err, rows) => {
        if (err) {
            res.status(404).json({ error: err.message, stack: err.stack , success:false});
            return;
        }
        res.status(200).json({ data: rows.recordset, success: true })
    })
}

const GetImagenesUnProducto = (req, res) => {
    const { stridproducto } = req.params
    const query = `select StrArchivo from TblImagenes where StrIdCodigo = '${stridproducto}' and IntOrden != 0`

    HGI.query(query, (err, rows) => {
        if (err) {
            res.status(404).json({ error: err.message, stack: err.stack ,success:false});
            return
        }
        res.status(200).json({ data: rows.recordset, success: true })
    })
}

const GetMarcas = async(req,res) =>{
    try {
        const data = await GET_MARCAS()
        res.status(200).json({marcas:data})
    } catch (error) {
        res.status(400).json({error})
    }
}

const GetGeneros = async(req,res) =>{
    try {
        const data = await GET_GENEROS()
        res.status(200).json({generos:data})
    } catch (error) {
        res.status(400).json({error})
    }
}

const GetUnidades = async(req,res)=>{
    try {
        const data = await GET_UNIDADES()
        res.status(200).json({unidades:data})
    } catch (error) {
        res.status(400).json({error})
    }
}


module.exports = { GetInfoProductos, GetImagenesUnProducto,GetMarcas,GetGeneros,GetUnidades }