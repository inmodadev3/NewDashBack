const { GetPedidosEnProceso_query, GetPedidosEnTerminal_Query, GetPedidosNuevos_Query, GetInfoPedido_Query, GetInfoPedidoTerminal_Query, GetPedidoXId_Query } = require('../../Querys/Pedidos_Querys')
const { GetUbicaciones } = require('../../helpers/helpers')

const DASH = require('../../databases/DashConexion').dashConexion

//Obtener pedidos nuevos
const GetPedidosNuevos = async(req, res) => {
    try {
        let data = await GetPedidosNuevos_Query()
        res.status(200).json({data:data, success:true})
    } catch (error) {
        res.status(400).json({error,message:"Ha ocurrido un error al obtener los pedidos nuevos ",success:false})
        throw error
    }
}

const GetPedidosEnProceso = async(req, res) => {
    
    try {
        let data = await GetPedidosEnProceso_query()
        res.status(200).json({data:data, success:true})
    } catch (error) {
        res.status(400).json({error,message:"Ha ocurrido un error al obtener los pedidos En proceso ",success:false})
        throw error
    }
}

const GetPedidosEnTerminal = async(req, res) => {
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
        const {detallePedido,header} = GetInfoPedidoTerminal_Query(id)
        res.status(200).json({ header: header, data: detallePedido, success: true });
    } catch (err) {
        res.status(400).json({ error: err.message, stack: err.stack, success: false });
    }
};

const GetPedidoXId = async(req,res) =>{
    const { id } = req.params
    try {
        const data = await GetPedidoXId_Query(id)
        res.status(200).json({data:data,success:true})
    } catch (error) {
        res.status(400).json({error:err.message , stack:err.stack , success:false})
        throw error
    }
}



module.exports = {
    GetPedidosNuevos,
    GetPedidosEnProceso,
    GetPedidosEnTerminal,
    GetInfoPedido,
    GetInfoPedidoTerminal,
    GetPedidoXId
}