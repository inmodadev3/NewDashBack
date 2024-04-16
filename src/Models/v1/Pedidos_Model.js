const Pedidos = {}

Pedidos.GetPedidos = () => {
    return `SELECT TP.intIdPedido,TP.strIdPedidoVendedor,TP.strNombVendedor,TP.strNombCliente,
    TP.dtFechaFinalizacion,TP.dtFechaEnvio,TP.intValorTotal,TP.intEstado, TS.estado as pago, TS.isDropi
    FROM tblPedidos as TP
    LEFT JOIN TblSeguimientoPedidos as TS on TP.intIdPedido = TS.intIdPedido
    order by intIdPedido desc limit 1000 offset 0`
}

Pedidos.GetUbicaciones = (strIdProducto) => {
    return `select StrParam2 from TblProductos where StrIdProducto = '${strIdProducto}'`
}

Pedidos.InfoPedido = {
    Body: () => {
        return `SELECT * FROM tbldetallepedidos where intIdpedido = ? and intEstado != -1`
    },
    Header: () => {
        return `SELECT strIdCliente,strNombCliente,strCiudadCliente,strTelefonoClienteAct,dtFechaEnvio,strNombVendedor,intIdpedido,strCorreoClienteAct,strObservacion,intValorTotal FROM tblpedidos where intIdPedido = ?`
    },
    Footer: (strIdCliente) => {
        return `SELECT strDato0 as observacion FROM TblTerceros where StrIdTercero = '${strIdCliente}'`
    }
}

Pedidos.ValidarPreciosPDF = {
    PrecioTercero: (terceroId) => {
        return `select IntPrecio from TblTiposTercero as TiposT 
        inner join TblTerceros as T on TiposT.IntIdTipoTercero = T.IntTipoTercero
        where T.StrIdTercero = '${terceroId}'`
    },
    PrecioProducto: (precio, producto) => {
        return `Select intPrecio${precio} from tblProductos where StrIdProducto = '${producto}'`
    }
}

Pedidos.BuscarPedido = (Condicional, dato) => {
    return `SELECT TP.intIdPedido,TP.strIdPedidoVendedor,TP.strNombVendedor,TP.strNombCliente,
    TP.dtFechaFinalizacion,TP.dtFechaEnvio,TP.intValorTotal,TP.intEstado, TS.estado as pago, TS.isDropi
    FROM tblPedidos as TP
    LEFT JOIN TblSeguimientoPedidos as TS on TP.intIdPedido = TS.intIdPedido 
    where ${Condicional} like '%${dato}%' order by intIdPedido desc limit 80 offset 0`
}

Pedidos.CambiarEstado = () => {
    return `UPDATE tblpedidos SET intEstado = ? where intIdPedido = ?`
}

Pedidos.CambiarPrecioTotal = () => {
    return `UPDATE tblpedidos SET intValorTotal = ? where intIdPedido = ?`
}

Pedidos.SeguimientoPedido = {
    InformacionBasicaPedido: () => {
        return `select strNombCliente,strCiudadCliente,dtFechaEnvio,strNombvendedor, strIdCliente from dash.tblpedidos where intIdPedido = ?`
    },
    InformacionSeguimientoDash: () => {
        return `select * from TblSeguimientoPedidos where intIdPedido = ?`
    },
    InformacionFacturaPedidoHGI: (documento) => {
        return `select intDocumento, DatFecha from TblDocumentos where IntDocRef = '${documento}' and IntTransaccion in ('041','47')`
    },
    CreditoCliente: (idTercero) => {
        return `select IntCupo from TblTerceros where StrIdTercero = '${idTercero}'`
    },
    CrearSeguimiento: () => {
        return `insert into TblSeguimientoPedidos (
            intIdPedido,
            id_encargado,
            Pago,
            Ciudad,
            Vendedor,
            TipoVenta,
            NroFactura,
            TipoEnvio,
            NroGuia,
            Despacho,
            ValorEnvio,
            NroCajas,
            Comentarios,
            Fecha_Facura,
            Fecha_Pedido,
            Fecha_Envio,
            isDropi,
            Devolucion,
            Recaudo,
            estado,
            cliente,
            id_encargado2,
            id_encargado3,
            id_encargadoFacturacion,
            id_encargadoRevision,
            Cartera
        ) VALUES (
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
        )`
    },
    ActulizarSeguimiento: () => {
        return `UPDATE TblSeguimientoPedidos SET  NroFactura = ?, Cliente = ?, Vendedor = ?, Ciudad = ?, Pago = ?, TipoVenta = ?, id_encargado = ?, id_encargado2 = ?, id_encargado3 = ?, id_encargadoRevision = ?, id_encargadoFacturacion = ?, TipoEnvio = ?, NroGuia = ?, Despacho = ?, ValorEnvio = ?, NroCajas = ?, Comentarios = ?, Fecha_Facura = ?, Fecha_Pedido = ?, Fecha_Envio = ?, isDropi = ?, Devolucion = ?, Recaudo = ?, estado = ?, Cartera = ? WHERE intIdPedido = ?`
    }
}

Pedidos.Seguimientos = (orden = 'id') => {
    return `select * from TblSeguimientoPedidos order by ${orden} desc limit 500 offset 0 `
}

Pedidos.Encargados = {
    Consultar: () => {
        return `select E.id , E.nombre, E.tipo_encargado_id, E.intEstado, TE.tipo_encargado from dash.TblEncargados as E
        inner join dash.TblTipoEncargados as TE on TE.id = E.tipo_encargado_id
        where intEstado = 1`
    },
    Agregar:() =>{
        return `insert into TblEncargados (nombre,tipo_encargado_id,intEstado) VALUES (?,?,?)`
    }
}

module.exports = Pedidos