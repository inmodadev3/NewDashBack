const Gestiones = {}

Gestiones.EditarGestion_Model = () => {
    return `UPDATE tblgestiondestapemadrinatercero set strObservacion = ? where intIdGestion = ?`
}

Gestiones.EliminarGestion_Model = () => {
    return `DELETE FROM tblgestiondestapemadrinatercero WHERE intIdGestion = ?;`
 }



module.exports = Gestiones