const ProductosQuery = require("../../Querys/Movil/Productos_Query")

const Productos_Controller = {}

Productos_Controller.Xid = async (req, res) => {
    const { id } = req.params

    try {
        const producto = await ProductosQuery.Id(id)
        res.status(200).json({ producto:producto })
    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}

module.exports = Productos_Controller