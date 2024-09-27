const { ObtenerVendedores_Query } = require("../../../Querys/Panel/Vendedores/Vendedores")

const vendedores_Controller = {}

vendedores_Controller.GetVendedores_Controller = async (req, res) => {
    try {
        const vendedores = await ObtenerVendedores_Query()
        res.json({ vendedores })
    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}


module.exports = vendedores_Controller