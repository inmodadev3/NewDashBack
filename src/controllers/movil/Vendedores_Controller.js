const VendedoresQuery = require("../../Querys/Movil/Vendedores_Query")

const VendedoresController = {}

VendedoresController.Login = async (req, res) => {
    const { user, password } = req.body
    try {
        const vendedor = await VendedoresQuery.Login(user, password)
        res.status(200).json({vendedor})
    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}

module.exports = VendedoresController