const { GetFacturas_Query, GetCartera_Query, GetRecaudos_Query, GetLiquidadas_Query, GetCarteraCiudades_Query } = require("../../Querys/Panel/Movimientos_Querys")


const GetFacturas = async (req, res) => {
    try {
        const { mes, año, strIdVendedor } = req.query
        const data = await GetFacturas_Query(mes, año, strIdVendedor)
        res.status(200).json({ data })
    } catch (error) {
        res.status(400).json({ data: error })
    }
}

const GetCartera = async (req, res) => {
    try {
        const { strIdVendedor } = req.query
        const data = await GetCartera_Query(strIdVendedor)
        res.status(200).json({ data })
    } catch (error) {
        res.status(400).json({ data: error })
    }
}

const GetRecaudos = async (req, res) => {
    try {
        const { mes, año, strIdVendedor, login } = req.query
        const data = await GetRecaudos_Query(mes, año, strIdVendedor, login & login)
        res.status(200).json({ data })
    } catch (error) {
        res.status(400).json({ data: error })
    }
}

const GetLiquidadas = async (req, res) => {
    try {
        const { mes, año, strIdVendedor, login } = req.query
        const data = await GetLiquidadas_Query(mes, año, strIdVendedor, login & login)
        res.status(200).json({ data })
    } catch (error) {
        res.status(400).json({ data: error })
    }
}

const GetCarteraCiudades =async(req,res)=>{
    try {
        const { strIdVendedor } = req.query
        const data = await GetCarteraCiudades_Query(strIdVendedor)
        res.status(200).json({ data })
    } catch (error) {
        res.status(400).json({ data: error })
    }
}


module.exports = {
    GetFacturas,
    GetCartera,
    GetRecaudos,
    GetLiquidadas,
    GetCarteraCiudades
}