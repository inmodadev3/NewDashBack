const DASH = require('../../databases/DashConexion').dashConexion
const xlsx = require('xlsx')
const { 
    COMPRAS, 
    ACTUALIZAR_ESTADO_PRODUCTOS,
    GetProductosContenedorEstado_Query,
    PostDataProductoContenedor_Dash_Query,
    PostDataProductoContenedor_Hgi_Query,
    PostPreciosEmpresa_Query,
    Post_Liquidar_Query,
    GetProductosLiquidados_Query
} = require('../../Querys/Compras_Querys')

const CargarDetallesContenedor = async (req, res) => {
    //excel, importacion, raggi
    const file = req.file
    const { importacion, raggi } = req.body
    const fecha = new Date()

    //Validar que halla llegado un archivo
    if (!file) {
        return res.status(400).json({ error: 'No se ha seleccionado ningún archivo' })
    }

    //Convertir el archivo xlsx en un objeto Json 
    const workbook = xlsx.read(file.buffer, { type: 'buffer' }) //transoformar el buffer en un archivo xlsx
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    //Validar que el documento tenga datos
    if (data.length === 0) {
        return res.status(200).json({ error: 'El archivo no tiene datos.' })
    }

    //Calcular el total de la compra
    let total = 0
    let array = []
    data.forEach((item) => {

        let stringNumero = ((item.Valor).toFixed(2))/* .replace(".","").replace(",",".")  */
        let numero = parseFloat(stringNumero)
        total += numero * (item.Cantidad)
    })

    let sql = COMPRAS.POSTDOCUMENTOS

    let sqlDetalle = COMPRAS.POSTDETALLEDOCUMENTOS

    DASH.query(sql, [raggi, importacion, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, fecha, 100, 5, total], (err, rows) => {
        if (err) return res.status(404).json({ data: err, message: "HA OCURRIDO UN ERROR GENERANDO EL DOCUMENTO" })
        data.forEach((item) => {
            let stringNumero = ((item.Valor).toFixed(2))/* .replace(".","").replace(",",".") */
            let valorParseado = parseFloat(stringNumero)
            DASH.query(sqlDetalle, ["", item.Referencia, item.Cantidad, item['Unidad de Medida'], valorParseado, item.Descripcion, 1, item.Color, item.CxU, item.Dimension, "", item['Cantidad por paca'], item.Material], (err, rows) => {
                if (err) return res.json(404).json({ data: err, message: "Ha OCURRIDO UN ERROR INGRESANDO LOS PRODUCTOS" })
            })
        })

    })

    res.status(200).json({ data: data, message: "Compra Cargada con exito" })
}

//Obtener los productos para liquidar
const GetProductosContenedorEstado = async (req, res) => {
    try {
        const data = await GetProductosContenedorEstado_Query()
        res.status(200).json({ data: data })
    } catch (error) {
        res.status(400).json({ error, message: "Ha ocurrido un error al consultar los datos" })
    }
}

//Obtener productos que han sido liquidados en el contenedor actual
const GetProductosLiquidados = async(req,res) =>{
    try {
        let data = await GetProductosLiquidados_Query()
        res.status(200).json({data})
    } catch (error) {
        res.status(400).json({error,message:"Ha ocurrido un error inesperado"})
    }
}

//Obtener datos de un producto tanto del HGI como del documento de liquidacion para hacer comparacion
const PostDataProductoContenedor = async (req, res) => {
    const { id, referencia } = req.body

    try {
        const queryInfoDash = await PostDataProductoContenedor_Dash_Query(id)
        const queryInfoHgi = await PostDataProductoContenedor_Hgi_Query(referencia)

        res.status(200).json({ dash: queryInfoDash[0], hgi: queryInfoHgi[0] })
    } catch (error) {
        res.status(400).json({ error, message: "Ha ocurrido un error con la consulta" })
    }
}

//Obtener lista de precios predefinidos en base al precio 1
const PostPreciosEmpresa = async (req, res) => {
    const { precio } = req.body

    if (precio !== 0 && precio !== null && precio !== undefined) {
        try {
            let data = await PostPreciosEmpresa_Query(precio)
            res.status(200).json({ data: data[0] })
        } catch (error) {
            res.status(400).json({ error, message: "Ha ocurrido un error" })
        }
    }else{
        res.status(400).json({message:"Precio incorrecto"})
    }

}

//Opcion para liquidar un producto
const Post_Liquidar = async (req,res) =>{
    const {
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
        strColor,
    } = req.body

    try {
        let data = await Post_Liquidar_Query(intIdDetalle,strDescripcion,intPrecioUno,intPrecioDos,intPrecioTres,
            intPrecioCuatro,intPrecioCinco,strReferencia,intCantidad,strUDM,intEstado,strDimension,intCxU,
            strUnidadMedida,intCantidadPaca,strMaterial,strObservacion,strSexo,strMarca,strColor)

        let liquidados = await GetProductosLiquidados_Query()

        res.status(200).json({success:true, data,liquidados})
    } catch (error) {
        res.status(400).json({error,message:"Ha ocurrido un error inesperado"})
    }
}

//Convertir un producto de estado liquidado a por liquidar para modificar datos en caso de ser necesario
const Put_Modificar = async (req, res) => {
    const { id } = req.params; // Obtener el id desde req.params
    try {
        await ACTUALIZAR_ESTADO_PRODUCTOS(1, parseInt(id));
        let liquidar = await GetProductosContenedorEstado_Query()
        res.status(200).json({ data:liquidar });
    } catch (error) {
        res.status(400).json({ error, message: "Ha ocurrido un error al actualizar el producto" });
    }
}

module.exports = {
    CargarDetallesContenedor,
    GetProductosContenedorEstado,
    PostDataProductoContenedor,
    PostPreciosEmpresa,
    Post_Liquidar,
    GetProductosLiquidados,
    Put_Modificar
}