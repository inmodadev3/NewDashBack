const route = require('express').Router()
const {
    GetClases,
    GetLineas,
    GetGrupo,
    GetTipo,
    GetCategorias
} = require('../../controllers/tienda/Categorias_Controller')

const categoriasCacheMiddleware = require('../../middlewares/Cache/CategoriasCache_Middleware')


route.get('/array', categoriasCacheMiddleware, GetCategorias)
route.get('/', GetClases)
route.get('/lineas', GetLineas)
route.get('/lineas/grupos', GetGrupo)
route.get('/lineas/grupos/tipos', GetTipo)




module.exports = route