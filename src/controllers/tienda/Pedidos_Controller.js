const { Crear_Pedido_Query, Agregar_productos_Query, Actualizar_Cantidad_Observacion_Producto_Query, Consultar_CantidadProductos_Pedido_Query, Consultar_Producto_Agregado_Query, Eliminar_Producto_query, Eliminar_TodosLosProductos_Query, Consultar_Productos_Query, Consultar_Datos_Cliente_Query, Validar_Agotados_Pedido_Query, Validar_Precios_Pedido_Query, Actualizar_Agotados_Pedido_Query, Actualizar_Cambios_Precios_Pedido_Query, Enviar_pedido_Database_Query, Obtener_Telefono_Vendedor_Query, Enviar_Pedido_Local_Query } = require("../../Querys/tienda/Pedidos_Query")

const Crear_Pedido = async (req, res) => {

    const { vendedor, cliente } = req.body

    try {
        const data = await Crear_Pedido_Query(vendedor, cliente)
        if (data == 1) {
            res.status(201).json({ message: "Pedido Creado Correctamente" })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error })
    }
}

const Agregar_productos = async (req, res) => {
    const { idVendedor, cliente, producto } = req.body
    try {
        const data = await Agregar_productos_Query(idVendedor, cliente, producto)
        if (data === 1) {
            res.status(200).json({ message: "Agregado correctamente" })
        }
    } catch (error) {
        res.status(400).json({ message: `${error}` })
    }
}

const Actualizar_Cantidad_Observacion_Producto = async (req, res) => {
    const { cantidad, observacion, id , strIdCliente } = req.body
    try {
        const data = await Actualizar_Cantidad_Observacion_Producto_Query(cantidad, observacion, id, strIdCliente)
        if (data === 1) {
            res.status(200).json({ message: "Datos actualizados correctamente" })
        }
    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}

const Consultar_CantidadProductos_Pedido = async (req, res) => {
    const { idCliente } = req.params
    try {
        const data = await Consultar_CantidadProductos_Pedido_Query(idCliente)
        res.status(200).json({ data })
    } catch (error) {
        res.status(400).json({ message: `${error}` })
    }
}

const Consultar_Producto_Agregado = async (req, res) => {
    const { id, p } = req.query
    try {
        const data = await Consultar_Producto_Agregado_Query(id, p)
        res.status(200).json({ data: data })
    } catch (error) {
        res.status(400).json({ message: `${error}` })
    }
}

const Consultar_Productos_Pedido = async(req,res)=>{
    const {strIdCliente} = req.params
    try {
        const data = await Consultar_Productos_Query(strIdCliente)
        res.status(200).json({ data: data })
    } catch (error) {
        res.status(400).json({ message: `${error}` })
    }
}

const Eliminar_Producto = async (req, res) => {
    const { id, strIdCliente } = req.params

    try {
        const data = await Eliminar_Producto_query(id, strIdCliente)
        if (data === 1) {
            res.status(200).json({ message: "Producto eliminado correctamente del pedido" })
        }
    } catch (error) {
        res.status(400).json({ message: `${error}` })
    }
}

const Eliminar_TodosLosProductos = async(req,res) =>{
    const { id, strIdCliente } = req.params
    try {
        const data = await Eliminar_TodosLosProductos_Query(id,strIdCliente)
        if(data === 1){
            res.status(200).json({message:"Pedido limipiado con exito"})
        }
    } catch (error) {
        res.status(400).json({message:`${error}`})
    }
}

const Consultar_Datos_Cliente = async(req,res) =>{
    try {
        const { strIdCliente } = req.params
        const data = await Consultar_Datos_Cliente_Query(strIdCliente)
        res.status(200).json({data:data})
    } catch (error) {
        res.status(400).json({message:`${error}`})
    }
}

const Validar_Pedido = async(req,res)=>{
    const { arrProductos, strIdCliente,precio } = req.body
    try {
        const validar_agotados = await Validar_Agotados_Pedido_Query(arrProductos)
        const validar_precios = await Validar_Precios_Pedido_Query(arrProductos,strIdCliente,precio)

        res.status(200).json({agotados:validar_agotados, cambios_precio:validar_precios})
    } catch (error) {
        res.status(400).json({message:`${error}`})
    }
}

const Actualizar_Agotados_Precios_Pedido = async(req,res) =>{
    const { arrIdAgotados, arrIdCambios } = req.body
    try {
        Actualizar_Agotados_Pedido_Query(arrIdAgotados)
        Actualizar_Cambios_Precios_Pedido_Query(arrIdCambios)
        res.status(200).json({message:"Informacion actualizada con exito"})
    } catch (error) {
        res.status(400).json({message:`${error}`})
    }
}

const Enviar_pedido = async(req,res) =>{
    const { id } = req.params
    const { strObservacion, seller } = req.body
    try {
        const data = await Enviar_pedido_Database_Query(id,strObservacion,seller)
        res.status(200).json({message:"Pedido Enviado",data:data})
    } catch (error) {
        res.status(400).json({message:`${error}`})

    }
}

const Enviar_Pedido_Local = async(req,res) =>{
    const { dataCliente , arrProductos , seller } = req.body
    try {

        const data = await Enviar_Pedido_Local_Query(
            0,
            seller,
            dataCliente.cedula,
            dataCliente.nombre,
            dataCliente.ciudad,
            dataCliente.valorTotal,
            dataCliente.fechaEnvio,
            dataCliente.obrservacion,
            "",
            dataCliente.telefono,
            dataCliente.ciudad,
            seller,
            arrProductos
        )

        res.status(200).json({message:"Pedido Enviado",data:data})
    } catch (error) {
        res.status(400).json({message:`${error}`})
    }
}

const Obtener_Telefono_Vendedor = async(req,res)=>{
    const { id } = req.params
    try {
        const data = await Obtener_Telefono_Vendedor_Query(id)
        res.status(200).json({data})
    } catch (error) {
        res.status(400).json({message:`${error}`})
    }
}


module.exports = {
    Crear_Pedido,
    Agregar_productos,
    Actualizar_Cantidad_Observacion_Producto,
    Consultar_CantidadProductos_Pedido,
    Consultar_Producto_Agregado,
    Eliminar_Producto,
    Eliminar_TodosLosProductos,
    Consultar_Productos_Pedido,
    Consultar_Datos_Cliente,
    Validar_Pedido,
    Actualizar_Agotados_Precios_Pedido,
    Enviar_pedido,
    Obtener_Telefono_Vendedor,
    Enviar_Pedido_Local
}