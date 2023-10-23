const route = require('express').Router()
const { guardar_archivo } = require('../../controllers/tienda/Guardar_Pdfs_usuarios')
const { Registro_Usuarios_Dash, Usuarios_Registrados_Recientes, CambiarEstadoRegistro, Descargar_Ruth } = require('../../controllers/tienda/Registro_Usuarios_Controller')


route.post('/',guardar_archivo,Registro_Usuarios_Dash)

route.get('/',Usuarios_Registrados_Recientes)

route.put("/:id",CambiarEstadoRegistro)

route.get('/descargar/:nombreArchivo', Descargar_Ruth)

module.exports = route