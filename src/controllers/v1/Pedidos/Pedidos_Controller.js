const { GetPedidosEnProceso_query, GetPedidosEnTerminal_Query, GetPedidosNuevos_Query, GetInfoPedido_Query, GetInfoPedidoTerminal_Query, GetPedidoXId_Query, GetPedidos_Query, PutEstadoPedido_Query, PutEstadoProductoPedido_query, PostProductoPedido_query, PutActualizarPreciosPedidoQuery, GetReporteDropiPendientes_Query, GetReportesDropi_Query, GetReportesDropiCartera_Query } = require('../../../Querys/Panel/Pedidos/Pedidos_Querys')

const GetPedidos = async (req, res) => {

    const { anio, mes } = req.query

    try {
        let data = await GetPedidos_Query(anio, mes)
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
        res.status(400).json({ error: error.message, stack: error.stack, success: false })
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
        const data = await PutEstadoProductoPedido_query(id, valor, valor_total, tipo, pedidoId)
        res.status(200).json({ response: data, success: true })

    } catch (error) {
        res.status(400).json({ error: error.message, stack: error.stack, success: false })
        throw error
    }
}

const PostProductoPedido = async (req, res) => {

    const { idCliente, idProducto, idPedido } = req.body
    try {
        const data = await PostProductoPedido_query(idCliente, idProducto, idPedido)
        res.status(200).json({ response: data, success: true })
    } catch (error) {
        res.status(400).json({ error: error.message, stack: error.stack, success: false })
        throw error
    }
}

const PutActualizarPreciosPedido = async (req, res) => {
    const { idPedido, intPrecio } = req.body
    try {
        const total = await PutActualizarPreciosPedidoQuery(idPedido, intPrecio)
        res.status(200).json({ total })
    } catch (error) {
        res.status(400).json({ error: error.message, stack: error.stack, success: false })
    }
}

const GetReporteDropiPendientes = async (req, res) => {
    try {
        const reporte = await GetReporteDropiPendientes_Query()
        res.status(200).json({ reporte })
    } catch (error) {
        res.status(400).json({ error: error.message, stack: error.stack, success: false })

    }
}

const GetReporteDropi = async (req, res) => {
    try {
        const params = req.query
        let query_paramsSQL = ''
        let sql = ''

        function fehcaFinal(fecha) {
            const anio = fecha.split('-')[0]
            const mes = parseInt(fecha.split('-')[1]) + 1

            return `${anio}-0${mes}-01`
        }

        switch (params.type) {
            case 'todos':
                query_paramsSQL = `dtFechaEnvio > '2024-04-18'`
                break;
            case 'rango':
                query_paramsSQL = `dtFechaEnvio > '${params.fechaIni}-01' and dtFechaEnvio < '${fehcaFinal(params.fechaFin)}'`
                break;
            case 'unico':
                query_paramsSQL = `dtFechaEnvio > '${params.fecha}-01' and dtFechaEnvio < '${fehcaFinal(params.fecha)}'`
                break;
        }

        if (query_paramsSQL !== "") {
            sql = `and ${query_paramsSQL}`
        }

        const reporte = await GetReportesDropi_Query(sql)

        console.log(reporte)

        res.status(200).json({ reporte })

    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}

const GetReportesDropiCartera = async (req,res) => {
    try {
        const reporte = await GetReportesDropiCartera_Query()
        res.status(200).json({reporte})
    } catch (error) {
        res.status(400).json({error:`${error}`})
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
    PutActualizarPreciosPedido,
    GetReporteDropiPendientes,
    GetReporteDropi,
    GetReportesDropiCartera
}