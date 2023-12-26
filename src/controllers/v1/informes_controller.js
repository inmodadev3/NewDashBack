const {Consultar_Ventas_Empleados_Query, Consultar_Ventas_DiasdelMes_Query, Consultar_Datos_generalesMes_Query, Consultar_Top_compradoresMes_Query} = require('../../Querys/informe_Query')


const Consultar_Ventas_Empleados = async(req,res) =>{
    const { mes, anio } = req.body
    try {
        const ventas = await Consultar_Ventas_Empleados_Query(mes,anio)
        res.status(200).json({ventas})
    } catch (error) {
        res.status(400).json({error:error})
    }
}

const Consultar_Ventas_DiasdelMes = async(req,res)=>{
    const { mes, anio } = req.body
    try {
        const ventas = await Consultar_Ventas_DiasdelMes_Query(mes, anio)
        res.status(200).json({ventas})
    } catch (error) {
        res.status(400).json({error})
    }
}

const Consultar_Datos_generalesMes = async(req,res) =>{
    const { mes , anio } = req.body

    try {
        const data = await Consultar_Datos_generalesMes_Query(mes,anio)
        res.status(200).json({data})
    } catch (error) {
        res.status(400).json({error})
    }
}

const Consultar_Top_CompradoresMes = async(req,res)=>{
    const { mes, anio } = req.body
    try {
        const clientes =  await Consultar_Top_compradoresMes_Query(mes,anio)
        res.status(200).json({clientes})
    } catch (error) {
        res.status(400).json({error})
    }
}


module.exports = {
    Consultar_Ventas_Empleados,
    Consultar_Ventas_DiasdelMes,
    Consultar_Datos_generalesMes,
    Consultar_Top_CompradoresMes
}