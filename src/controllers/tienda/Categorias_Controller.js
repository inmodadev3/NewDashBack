const {
    GetClases_Query,
    GetLineas_Query,
    GetGrupo_Query,
    GetTipo_Query,
} = require('../../Querys/tienda/Categorias_Querys')

//OBTENER CATEGORIA PRINCIPAL O CLASES
const GetClases = async (req, res) => {
    try {
        const data = await GetClases_Query()
        res.status(200).json({ success: true, data: data })
    } catch (error) {
        res.status(400).json({ success: false, data: error })
    }
}

//OBTENER SUBCATEGORIA1 O LINEAS
const GetLineas = async (req, res) => {
    const { clase } = req.query

    try {
        const data = await GetLineas_Query(clase)
        res.status(200).json({ success: true, data: data })
    } catch (error) {
        res.status(400).json({ success: false, data: error })
    }
}

//OBTENER SUBCATEGORIA2 O GRUPOS
const GetGrupo = async (req, res) => {
    const { linea } = req.query

    try {
        const data = await GetGrupo_Query(linea)
        res.status(200).json({ success: true, data: data })
    } catch (error) {
        res.status(400).json({ success: false, data: error })
    }
}

//OBTENER SUBCATEGORIA3 O TIPOS
const GetTipo = async(req, res) => {
    const { Grupo,Linea } = req.query

    try {
        const data = await GetTipo_Query(Grupo,Linea)
        if(data.strIdTipo !== 0){
            res.status(200).json({ success: true, data: data })
        }else{
            res.status(200).json({ success: true, data: [] })
        }
    } catch (error) {
        res.status(400).json({ success: false, data: error })
    }
}

module.exports = { GetClases, GetLineas, GetGrupo, GetTipo }