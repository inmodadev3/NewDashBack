const route = require('express').Router()

const {
    getFolders,
    createPDF
} = require('../../controllers/v1/catalogos_controller')

route.post('/',getFolders)
route.post('/generar',createPDF)


module.exports = route