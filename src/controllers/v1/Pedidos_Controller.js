const { GetUbicaciones } = require('../../helpers/helpers')

const DASH = require('../../databases/DashConexion').dashConexion

const GetPedidosNuevos = (req, res) => {
    const query = `SELECT intIdPedido,strIdPedidoVendedor,strNombVendedor,strNombCliente,dtFechaFinalizacion,dtFechaEnvio,intValorTotal FROM tblPedidos where intEstado = 1`

    DASH.query(query, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message, stack: err.stack, success: false })
        }

        res.status(200).json({ data: rows, success: true })
    })
}

const GetPedidosEnProceso = (req, res) => {
    const query = `SELECT intIdPedido,strIdPedidoVendedor,strNombVendedor,strNombCliente,dtFechaFinalizacion,dtFechaEnvio,intValorTotal
     FROM tblPedidos where intEstado in (2,3,4,5) order by intIdPedido desc limit 80 offset 0 `

    DASH.query(query, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message, stack: err.stack, success: false })
        }

        res.status(200).json({ data: rows, success: true })
    })
}

const GetPedidosEnTerminal = (req, res) => {
    const query = `SELECT intIdPedido,strNombVendedor,strNombCliente,intValorTotal,dtFechaEnvio FROM tblPedidosterminal where intEstado = 1 order by intIdPedido desc`
    DASH.query(query, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message, stack: err.stack, success: false })
        }
        res.status(200).json({ data: rows, success: true })
    })
}

const GetInfoPedido = async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM tbldetallepedidos where intIdpedido = ?`;
    const queryCabecera = `SELECT strIdCliente,strNombCliente,strCiudadCliente,strTelefonoClienteAct,dtFechaEnvio,strNombVendedor,intIdpedido,strCorreoClienteAct,strObservacion,intValorTotal FROM tblpedidos where intIdPedido = ?`;

    try {
        const rows = await new Promise((resolve, reject) => {
            DASH.query(query, [id], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        let detallePedido = [];

        for (const item of rows) {
            let ubicaciones = await GetUbicaciones(item.strIdProducto);
            detallePedido.push({ ...item, ubicaciones: ubicaciones[0].StrParam2 });
        }

        const header = await new Promise((resolve, reject) => {
            DASH.query(queryCabecera, [id], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
        res.status(200).json({ header: header[0], data: detallePedido, success: true });
    } catch (err) {
        res.status(400).json({ error: err.message, stack: err.stack, success: false });
    }
};

const GetInfoPedidoTerminal = async (req, res) => {
    const { id } = req.params;
    const query = `SELECT * FROM tbldetallepedidosterminal where intIdpedido = ?`;
    const queryCabecera = `SELECT strIdCliente,strNombCliente,strCiudadCliente,strTelefonoClienteAct,dtFechaEnvio,strNombVendedor,intIdpedido FROM tblpedidosterminal where intIdPedido = ?`;

    try {
        const rows = await new Promise((resolve, reject) => {
            DASH.query(query, [id], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        let detallePedido = [];

        for (const item of rows) {
            let ubicaciones = await GetUbicaciones(item.strIdProducto);
            detallePedido.push({ ...item, ubicaciones: ubicaciones[0].StrParam2 });
        }

        const rows2 = await new Promise((resolve, reject) => {
            DASH.query(queryCabecera, [id], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        res.status(200).json({ header: rows2, data: detallePedido, success: true });
    } catch (err) {
        res.status(400).json({ error: err.message, stack: err.stack, success: false });
    }
};

const GetPedidoXId = (req,res) =>{
    const { id } = req.params
    const query = `SELECT intIdPedido,strIdPedidoVendedor,strNombVendedor,strNombCliente,dtFechaFinalizacion,dtFechaEnvio,intValorTotal
    FROM tblPedidos where intIdPedido like '${id}%' order by intIdPedido desc limit 80 offset 0`

    DASH.query(query,(err,rows)=>{
        if(err){
            res.status(400).json({error:err.message , stack:err.stack , success:false})
        }

        res.status(200).json({data:rows,success:true})
    })
}



module.exports = {
    GetPedidosNuevos,
    GetPedidosEnProceso,
    GetPedidosEnTerminal,
    GetInfoPedido,
    GetInfoPedidoTerminal,
    GetPedidoXId
}