const { ObtenerCiudades_Query } = require("../../../Querys/Panel/Ciudades/Ciudades_Querys")

const Ciudades_Controller = {}


Ciudades_Controller.ObtenerCiudades_Controller = async (req, res) => {
    try {
        const ciudades = await ObtenerCiudades_Query()
        res.json({ ciudades })
    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}

module.exports = Ciudades_Controller