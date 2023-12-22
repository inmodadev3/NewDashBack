const { Consultar_lista_permisos, Crear_nuevo_permiso, Consultar_permisos_usuario, Eliminar_Permiso, Agregar_Permiso } = require('../../controllers/v1/permisos_controller')

const route = require('express').Router()

route.get('/',Consultar_lista_permisos)
route.post('/',Crear_nuevo_permiso)
route.post('/usuario',Agregar_Permiso)
route.get('/:id_usuario',Consultar_permisos_usuario)
route.delete('/:id_usuario/:id_permiso',Eliminar_Permiso)
    

module.exports = route