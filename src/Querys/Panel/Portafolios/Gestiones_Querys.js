const { EditarGestion_Model, EliminarGestion_Model } = require('../../../Models/v1/Portafolios/Gestiones')
const { obtenerDatosDb_Dash } = require('../../Global_Querys')

const EditarGestion_Query = (idGestion, observacion) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = EditarGestion_Model()
            await obtenerDatosDb_Dash(query, [observacion, idGestion])
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}

const EliminarGestion_Query = (idGestion) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = EliminarGestion_Model()
            await obtenerDatosDb_Dash(query, [idGestion])
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    EditarGestion_Query,
    EliminarGestion_Query
}