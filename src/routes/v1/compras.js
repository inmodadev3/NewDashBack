const multer = require('multer')
const route = require('express').Router()
const {
    CargarDetallesContenedor
} = require('../../controllers/v1/compras_Controller')

const storage = multer.memoryStorage()
const upload = multer({storage})

route.post('/cargar/detalles',upload.single('file'),CargarDetallesContenedor)


module.exports = route