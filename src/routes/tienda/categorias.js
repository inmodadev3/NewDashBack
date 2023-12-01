const route = require('express').Router()
const {
    GetClases,
    GetLineas,
    GetGrupo,
    GetTipo
} = require('../../controllers/tienda/Categorias_Controller')

route.get('/',GetClases)

route.get('/lineas',GetLineas)
route.get('/lineas/grupos',GetGrupo)
route.get('/lineas/grupos/tipos',GetTipo)




module.exports = route