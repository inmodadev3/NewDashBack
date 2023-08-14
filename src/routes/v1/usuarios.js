const routes = require('express').Router()
const {
    validarUsuario,
    ValidarTokenUsuario,
    ValidarPermisosUsuario
} = require('../../controllers/v1/Usurarios_Controller')

const verifyToken = require('../../helpers/jsonWebToken')

routes.get('/',verifyToken,ValidarTokenUsuario)

routes.post('/login',validarUsuario)

routes.get('/permisos/:id',verifyToken, ValidarPermisosUsuario)

module.exports = routes