const { GetPedidosEnProceso_query, GetPedidosEnTerminal_Query, GetPedidosNuevos_Query, GetInfoPedido_Query, GetInfoPedidoTerminal_Query, GetPedidoXId_Query, GetPedidos_Query, PutEstadoPedido_Query, PutEstadoProductoPedido_query, PostProductoPedido_query, PutActualizarPreciosPedidoQuery } = require('../../Querys/Pedidos_Querys')
const { GetUbicaciones } = require('../../helpers/helpers')

const DASH = require('../../databases/DashConexion').dashConexion

const GetPedidos = async (req, res) => {
    try {
        let data = await GetPedidos_Query()
        res.status(200).json({ data: data, success: true })
    } catch (error) {
        res.status(400).json({ error, message: "Ha ocurrido un error al obtener los pedidos nuevos ", success: false })
        throw error
    }
}

//Obtener pedidos nuevos
const GetPedidosNuevos = async (req, res) => {
    try {
        let data = await GetPedidosNuevos_Query()
        res.status(200).json({ data: data, success: true })
    } catch (error) {
        res.status(400).json({ error, message: "Ha ocurrido un error al obtener los pedidos nuevos ", success: false })
        throw error
    }
}

//obtener pedidos en proceso (con id diferente de 1)
const GetPedidosEnProceso = async (req, res) => {

    try {
        let data = await GetPedidosEnProceso_query()
        res.status(200).json({ data: data, success: true })
    } catch (error) {
        res.status(400).json({ error, message: "Ha ocurrido un error al obtener los pedidos En proceso ", success: false })
        throw error
    }
}

//obtener data de pedidos en terminal
const GetPedidosEnTerminal = async (req, res) => {
    try {
        const data = await GetPedidosEnTerminal_Query()
        res.status(200).json({ data: data, success: true })
    } catch (error) {
        res.status(400).json({ error: err.message, stack: err.stack, success: false })
    }
}

const GetInfoPedido = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, header } = await GetInfoPedido_Query(id)
        res.status(200).json({ header: header[0], data: data, success: true });
    } catch (err) {
        res.status(400).json({ error: err.message, stack: err.stack, success: false });
    }
};

const GetInfoPedidoTerminal = async (req, res) => {
    const { id } = req.params;

    try {
        const { detallePedido, header } = GetInfoPedidoTerminal_Query(id)
        res.status(200).json({ header: header, data: detallePedido, success: true });
    } catch (err) {
        res.status(400).json({ error: err.message, stack: err.stack, success: false });
    }
};

const GetPedidoXId = async (req, res) => {
    const { id } = req.params
    try {
        const data = await GetPedidoXId_Query(id)
        res.status(200).json({ data: data, success: true })
    } catch (error) {
        res.status(400).json({ error: err.message, stack: err.stack, success: false })
        throw error
    }
}

const PutEstadoPedido = async (req, res) => {
    const { id, estado } = req.body
    try {
        const data = await PutEstadoPedido_Query(id, estado)
        res.status(200).json({ data: data, success: true })

    } catch (error) {
        res.status(400).json({ error: error.message, stack: error.stack, success: false })
        throw error
    }
}

const PutEstadoProductoPedido = async (req, res) => {
    const { id, valor, valor_total, tipo, pedidoId } = req.body
    try {
        await PutEstadoProductoPedido_query(id, valor, valor_total, tipo, pedidoId)
        res.status(200).json({ response: 1, success: true })

    } catch (error) {
        res.status(400).json({ error: error.message, stack: error.stack, success: false })
        throw error
    }
}

const PostProductoPedido = async (req, res) => {

    const { idCliente, idProducto,idPedido} = req.body
    try {
        const data = await PostProductoPedido_query(idCliente, idProducto,idPedido)
        res.status(200).json({ response: data, success: true })
    } catch (error) {
        res.status(400).json({ error: error.message, stack: error.stack, success: false })
        throw error
    }
}

const PutActualizarPreciosPedido = async(req,res) =>{
    const {idPedido , intPrecio} = req.body
    try {
        const total = await PutActualizarPreciosPedidoQuery(idPedido,intPrecio)
        res.status(200).json({total})
    } catch (error) {
        res.status(400).json({error:error.message, stack:error.stack , success:false})
    }
}


module.exports = {
    GetPedidosNuevos,
    GetPedidosEnProceso,
    GetPedidosEnTerminal,
    GetInfoPedido,
    GetInfoPedidoTerminal,
    GetPedidoXId,
    GetPedidos,
    PutEstadoPedido,
    PutEstadoProductoPedido,
    PostProductoPedido,
    PutActualizarPreciosPedido
}