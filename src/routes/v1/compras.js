const multer = require('multer')
const route = require('express').Router()
const {
    CargarDetallesContenedor,
    GetProductosContenedorEstado,
    PostDataProductoContenedor,
    PostPreciosEmpresa,
    Post_Liquidar,
    GetProductosLiquidados,
    Put_Modificar,
    Get_DataProducto_Modificar
} = require('../../controllers/v1/compras_Controller')

const storage = multer.memoryStorage()
const upload = multer({storage})

//LIQUIDACION
route.get('/',GetProductosContenedorEstado)
route.get('/liquidados',GetProductosLiquidados)
route.post('/liquidacion/producto',PostDataProductoContenedor)
route.post('/precios_empresa',PostPreciosEmpresa)
route.post('/liquidar',Post_Liquidar)
route.put('/modificar_liquidado/:id',Put_Modificar)
route.get('/modificar_liquidado/:id',Get_DataProducto_Modificar)

//COMPRAS
route.post('/cargar/detalles',upload.single('file'),CargarDetallesContenedor)


module.exports = route