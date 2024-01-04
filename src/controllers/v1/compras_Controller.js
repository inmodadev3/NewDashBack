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
    GetProductosLiquidados_Query,
    CargarDetallesContenedor_Query,
    CargarDetallesContenedorDatos_Query,
    Obtener_Compras_Query,
    Obtener_productos_compra_query
} = require('../../Querys/Compras_Querys')

const CargarDetallesContenedor = async (req, res) => {
    //excel, importacion, raggi

    try {
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
        data.forEach((item) => {
            let itemValues = Object.values(item)
            let stringNumero = (itemValues[5])/* .replace(".","").replace(",",".")  */
            let numero = parseFloat(stringNumero)
            total += numero * itemValues[3]
        })

        total = parseInt(total.toFixed(0))

        await CargarDetallesContenedor_Query(raggi,importacion,fecha,total)
        await CargarDetallesContenedorDatos_Query(data)
        res.status(200).json({ data: data, message: "Compra Cargada con exito" })

    } catch (error) {
        res.status(400).json({ error, message: "Ha ocurrido un error al intentar ingresar datos del contenedor" })
    }

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
const GetProductosLiquidados = async (req, res) => {
    try {
        let data = await GetProductosLiquidados_Query()
        res.status(200).json({ data })
    } catch (error) {
        res.status(400).json({ error, message: "Ha ocurrido un error inesperado" })
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
    } else {
        res.status(400).json({ message: "Precio incorrecto" })
    }

}

//Opcion para liquidar un producto
const Post_Liquidar = async (req, res) => {
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
        let data = await Post_Liquidar_Query(intIdDetalle, strDescripcion, intPrecioUno, intPrecioDos, intPrecioTres,
            intPrecioCuatro, intPrecioCinco, strReferencia, intCantidad, strUDM, intEstado, strDimension, intCxU,
            strUnidadMedida, intCantidadPaca, strMaterial, strObservacion, strSexo, strMarca, strColor)

        let liquidados = await GetProductosLiquidados_Query()

        res.status(200).json({ success: true, data, liquidados })
    } catch (error) {
        res.status(400).json({ error, message: "Ha ocurrido un error inesperado" })
    }
}

//Convertir un producto de estado liquidado a por liquidar para modificar datos en caso de ser necesario
const Put_Modificar = async (req, res) => {
    const { id } = req.params; // Obtener el id desde req.params
    try {
        await ACTUALIZAR_ESTADO_PRODUCTOS(1, parseInt(id));
        let liquidar = await GetProductosContenedorEstado_Query()
        res.status(200).json({ data: liquidar });
    } catch (error) {
        res.status(400).json({ error, message: "Ha ocurrido un error al actualizar el producto" });
    }
}

const Get_DataProducto_Modificar = async(req,res)=>{
    const { id } = req.params
    try {
        const data = await PostDataProductoContenedor_Dash_Query(id)
        res.status(200).json({ producto:data[0] })
    } catch (error) {
        res.status(400).json({ error, message: "Ha ocurrido un error al recuperar los datos para modificar" })
    }
}

const Get_Compras = async(req,res) =>{
    try {
        const data = await Obtener_Compras_Query()
        res.status(200).json({compras:data})
    } catch (error) {
        res.status(400).json({error,message:"Ha ocurrido un error al recuperar los datos de las compras"})
    }
}

const Get_Productos_Compra = async(req,res) =>{
    const { id } = req.query
    try {
        const data = await Obtener_productos_compra_query(id)
        res.status(200).json({productos:data})
    } catch (error) {
        res.status(400).json({error, message:`Ha ocurrido un error al recuperar los productos de la compra ${id}`})
    }
}

module.exports = {
    CargarDetallesContenedor,
    GetProductosContenedorEstado,
    PostDataProductoContenedor,
    PostPreciosEmpresa,
    Post_Liquidar,
    GetProductosLiquidados,
    Put_Modificar,
    Get_DataProducto_Modificar,
    Get_Compras,
    Get_Productos_Compra
}