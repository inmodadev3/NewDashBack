const { 
    GetInfoProductos,
    GetImagenesUnProducto,
    GetGeneros,
    GetMarcas,
    GetUnidades,
    GetInfoProductos_Nombre
} = require('../../controllers/v1/Productos_Controller')
const route = require('express').Router()

route.get('/imagenes/:stridproducto',GetImagenesUnProducto)
route.get('/generos',GetGeneros)
route.get('/marcas',GetMarcas)
route.get('/unidades',GetUnidades)

route.get('/nombre/:strNombre',GetInfoProductos_Nombre)
route.get('/:strIdProducto',GetInfoProductos)

module.exports = route