const { Consultar_PedidosEnProceso, Consultar_Detalles_Pedido_Proceso } = require("../../Querys/Panel/Procesos_Pedidos")

const GetPedidos = async(req,res) =>{
    const { strIdVendedor } = req.params
    try {
        const data = await Consultar_PedidosEnProceso(strIdVendedor)
        res.status(200).json({data})
    } catch (error) {
        res.status(400).json({message:`${error}`})
    }
}

const GetDetallePedidos = async(req,res)=>{
    const {id} = req.query
    try {
        const productos = await Consultar_Detalles_Pedido_Proceso(id)
        res.status(200).json({productos})
    } catch (error) {
        res.status(400).json({message:`${error}`})
    }
}


module.exports = {
    GetPedidos,
    GetDetallePedidos
}