const TercerosQuery = require("../../Querys/Movil/Terceros_Query")

const TercerosController = {}

TercerosController.Contados = async (req, res) => {
    try {
        const contados = await TercerosQuery.ContadosQuery()
        res.status(200).json({ contados })
    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}

TercerosController.TerceroXid = async (req, res) => {
    const { id } = req.params
    try {
        const tercero = await TercerosQuery.TercerosXIdQuery(id)
        res.status(200).json({ tercero: tercero[0] })
    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}

module.exports = TercerosController