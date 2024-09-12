const { EditarGestion_Query, EliminarGestion_Query } = require("../../../Querys/Panel/Portafolios/Gestiones_Querys")

const EditarGestion_Controller = async (req, res) => {
    const { id, observacion } = req.body
    try {
        await EditarGestion_Query(id, observacion);
        res.send(true)
    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}

const EliminarGestion_Controller = async (req, res) => {
    const { id } = req.params
    try {
        await EliminarGestion_Query(id)
        res.send(true)
    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}


module.exports = {
    EditarGestion_Controller,
    EliminarGestion_Controller
}