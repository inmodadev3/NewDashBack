const PosiblesClientes_Model = {}

PosiblesClientes_Model.CrearNuevoPosibleCliente_Model = () => {
    return `
    INSERT INTO TblPosiblesClientes 
        (strNombreCliente,strNombreLocal,intSegmento,strTelefono,strCelular,strLinea,strComentario,dtFechaCreacion,strCiudad,intEstado) 
    VALUES 
        (?,?,?,?,?,?,?,?,?,?)
    `
}

PosiblesClientes_Model.ActualizarPosibleCliente_Model = () => {
    return `
        UPDATE TblPosiblesClientes set
        strVendedor = ?,
        dtFechaUltimaGestion = ?,
        strComentario = ?,
        intEstado =?
        where intId = ?
    `
}

PosiblesClientes_Model.ConsultarPosibleClienteXEstado_Model = () => {
    return `SELECT * FROM TblPosiblesClientes WHERE intEstado = ? order by intId desc`
}

PosiblesClientes_Model.ActualizarEstado = () => {
    return `UPDATE TblPosiblesClientes
        SET intEstado = ?
        WHERE intId = ?`
}

PosiblesClientes_Model.EditarDatosCliente_Model = () => {
    return `
        UPDATE TblPosiblesClientes set
        strNombreCliente = ?,
        strNombreLocal = ?,
        intSegmento = ?,
        strTelefono = ?,
        strCelular = ?,
        strLinea = ?,
        strComentario = ?,
        strCiudad = ?
        where intId = ?
    `
}

module.exports = PosiblesClientes_Model