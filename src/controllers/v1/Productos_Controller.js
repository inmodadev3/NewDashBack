const { GetInfoProductos_Query, GetImagenesUnProducto_Query, GetMarcas_Query, GetGeneros_Query, GetUnidades_Query, GetInfoProductos_Nombre_Query, PostActualizarUbicacion_Query, GetProductoXidQuery } = require('../../Querys/Productos_Querys');


//obtener informacion acerca de un producto
const GetInfoProductos = async (req, res) => {
    const { strIdProducto } = req.params

    try {
        const data = await GetInfoProductos_Query(strIdProducto)
        res.status(200).json({ data: data, success: true })
    } catch (error) {
        res.status(404).json({ error: err.message, stack: err.stack, success: false });
    }
}

const GetInfoProductos_Nombre = async (req, res) => {
    const { strNombre } = req.params

    try {
        const data = await GetInfoProductos_Nombre_Query(strNombre)
        res.status(200).json({ data: data, success: true })
    } catch (error) {
        res.status(404).json({ error: err.message, stack: err.stack, success: false });
    }
}

//Obtener la lista de imagenes de un producto
const GetImagenesUnProducto = async (req, res) => {
    const { stridproducto } = req.params

    try {
        const data = await GetImagenesUnProducto_Query(stridproducto)
        res.status(200).json({ data: data, success: true })
    } catch (error) {
        res.status(404).json({ error: err.message, stack: err.stack, success: false });
        throw error
    }
}

//Obtener marcas registradas en HGI
const GetMarcas = async (req, res) => {
    try {
        const data = await GetMarcas_Query()
        res.status(200).json({ marcas: data })
    } catch (error) {
        res.status(400).json({ error })
    }
}

//Obtener Generos registrados en HGI
const GetGeneros = async (req, res) => {
    try {
        const data = await GetGeneros_Query()
        res.status(200).json({ generos: data })
    } catch (error) {
        res.status(400).json({ error })
    }
}

//Obtener lista de unidades de medida en HGI
const GetUnidades = async (req, res) => {
    try {
        const data = await GetUnidades_Query()
        res.status(200).json({ unidades: data })
    } catch (error) {
        res.status(400).json({ error })
    }
}

//Actualizar ubicaciones
const PostActualizarUbicacion = async (req, res) => {
    const {
        ubicacion, referencia, idUsuario, ultima_ubicacion
    } = req.body
    try {
        const data = await PostActualizarUbicacion_Query(ubicacion, referencia, idUsuario, ultima_ubicacion)
        res.status(200).json({ message: data })
    } catch (error) {
        res.status(400).json({ error: error })
    }
}

const GetProductoXid = async (req, res) => {

    const { strIdProducto } = req.params

    try {
        const data = await GetProductoXidQuery(strIdProducto)
        res.status(200).json({ data: data[0] })
    } catch (error) {
        res.status(400).json({ error: error })

    }
}


module.exports = { GetInfoProductos, GetImagenesUnProducto, GetMarcas, GetGeneros, GetUnidades, GetInfoProductos_Nombre, PostActualizarUbicacion,GetProductoXid }