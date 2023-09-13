const { GetInfoProductos_Query, GetImagenesUnProducto_Query, GetMarcas_Query, GetGeneros_Query, GetUnidades_Query } = require('../../Querys/Productos_Querys');


//obtener informacion acerca de un producto
const GetInfoProductos = async(req, res) => {
    const { strIdProducto } = req.params
    
    try {
        const data = await GetInfoProductos_Query(strIdProducto)
        res.status(200).json({ data: data, success: true })
    } catch (error) {
        res.status(404).json({ error: err.message, stack: err.stack , success:false});
    }
}

//Obtener la lista de imagenes de un producto
const GetImagenesUnProducto = async(req, res) => {
    const { stridproducto } = req.params

    try {
        const data = await GetImagenesUnProducto_Query(stridproducto)
        res.status(200).json({ data: data, success: true })
    } catch (error) {
        res.status(404).json({ error: err.message, stack: err.stack ,success:false});
        throw error
    }
}

//Obtener marcas registradas en HGI
const GetMarcas = async(req,res) =>{
    try {
        const data = await GetMarcas_Query()
        res.status(200).json({marcas:data})
    } catch (error) {
        res.status(400).json({error})
    }
}

//Obtener Generos registrados en HGI
const GetGeneros = async(req,res) =>{
    try {
        const data = await GetGeneros_Query()
        res.status(200).json({generos:data})
    } catch (error) {
        res.status(400).json({error})
    }
}

//Obtener lista de unidades de medida en HGI
const GetUnidades = async(req,res)=>{
    try {
        const data = await GetUnidades_Query()
        res.status(200).json({unidades:data})
    } catch (error) {
        res.status(400).json({error})
    }
}


module.exports = { GetInfoProductos, GetImagenesUnProducto,GetMarcas,GetGeneros,GetUnidades }