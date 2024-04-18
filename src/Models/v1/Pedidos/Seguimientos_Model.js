const Seguimientos = {}

Seguimientos.SeguimientoPedido = {
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

Seguimientos.Seguimientos = (orden = 'id') => {
    return `select * from TblSeguimientoPedidos order by ${orden} desc limit 500 offset 0 `
}

Seguimientos.PagosHGI = (DocumetoDash) => {
    return `select TD.IntDocRef ,COUNT(IntDocRef) as t from TblDocumentos as TD
    inner join QryPagos as QP on TD.IntDocumento = QP.Documento and TD.IntTransaccion = QP.Transaccion
    inner join TblConceptosPago as TC on TC.StrDescripcion = QP.BancoConDes
    where TD.IntDocRef = '${DocumetoDash}' and TD.IntTransaccion in ('47','99') and TC.StrIdConceptoPago = '01'
    group by TD.IntDocRef
    HAVING COUNT(TD.IntDocRef) > 0
    `
}

Seguimientos.Encargados = {
    Consultar: () => {
        return `select E.id , E.nombre, E.tipo_encargado_id, E.intEstado, TE.tipo_encargado from dash.TblEncargados as E
        inner join dash.TblTipoEncargados as TE on TE.id = E.tipo_encargado_id
        where intEstado = 1`
    },
    Agregar: () => {
        return `insert into TblEncargados (nombre,tipo_encargado_id,intEstado) VALUES (?,?,?)`
    }
}

module.exports = Seguimientos;