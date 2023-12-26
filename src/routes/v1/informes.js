const { Consultar_Ventas_Empleados, Consultar_Ventas_DiasdelMes, Consultar_Datos_generalesMes, Consultar_Top_CompradoresMes } = require('../../controllers/v1/informes_controller')

const route = require('express').Router()

route.post('/empleados', Consultar_Ventas_Empleados)
route.post('/dias',Consultar_Ventas_DiasdelMes)
route.post('/pedidos',Consultar_Datos_generalesMes)
route.post('/clientes',Consultar_Top_CompradoresMes)


module.exports = route