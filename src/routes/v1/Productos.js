const { 
    GetInfoProductos,
    GetImagenesUnProducto
} = require('../../controllers/v1/Productos_Controller')
const route = require('express').Router()

const verifyToken = require('../../helpers/jsonWebToken')


route.get('/:strIdProducto',verifyToken,GetInfoProductos)
route.get('/imagenes/:stridproducto',GetImagenesUnProducto)


module.exports = route