const { ObtenerCiudades_Query, obtenerDepartamentos_Query, obtenerCiudadesXDepartamento_Query } = require("../../../Querys/Panel/Ciudades/Ciudades_Querys")

const Ciudades_Controller = {}


Ciudades_Controller.ObtenerCiudades_Controller = async (req, res) => {
    try {
        const ciudades = await ObtenerCiudades_Query()
        res.json({ ciudades })
    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}

Ciudades_Controller.ObtenerDepartamentos_Controller = async (req, res) => {
    try {
        const departamentos = await obtenerDepartamentos_Query();
        res.json({ departamentos })
    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}

Ciudades_Controller.obtenerCiudadesXDepartamento_Controller = async (req, res) => {
    const { departamento } = req.params

    if (!departamento) {
        res.status(400).json({ error: `departamento invalido` })
    }

    try {
        const ciudades = await obtenerCiudadesXDepartamento_Query(departamento);
        res.json({ ciudades })
    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}

module.exports = Ciudades_Controller