const { obtenerGestiones_Query } = require("../../../Querys/Panel/Gestiones/gestiones")

const gestiones_Controler = {}

gestiones_Controler.ObtenerGestiones_Controller = async (req, res) => {
    const {
        filtrar,
        zona,
        vendedor,
        orden
    } = req.query

    try {

        if (!filtrar) {
            res.status(400).json({ error: 'Filtro invalido' })
        }

        if (!zona) {
            res.status(400).json({ error: 'Zona invalida' })
        }

        const gestiones = await obtenerGestiones_Query(filtrar, zona, vendedor, orden);

        res.json({ clientes: gestiones })

    } catch (error) {
        console.error(error)
    }
}

module.exports = gestiones_Controler