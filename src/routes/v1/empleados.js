const { Obtener_Empleados, Crear_Empleado, Actualizar_Empleado, Eliminar_Empleado } = require('../../controllers/v1/empleados_controller')

const route = require('express').Router()

route.get('/',Obtener_Empleados)

route.post('/crear',Crear_Empleado)

route.put('/actualizar',Actualizar_Empleado)

route.delete('/eliminar/:id',Eliminar_Empleado)

module.exports = route