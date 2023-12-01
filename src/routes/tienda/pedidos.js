const { Crear_Pedido, Agregar_productos, Actualizar_Cantidad_Observacion_Producto, Consultar_CantidadProductos_Pedido, Consultar_Producto_Agregado, Eliminar_Producto, Eliminar_TodosLosProductos, Consultar_Productos_Pedido, Consultar_Datos_Cliente, Validar_Pedido, Actualizar_Agotados_Precios_Pedido, Enviar_pedido, Obtener_Telefono_Vendedor, Enviar_Pedido_Local } = require('../../controllers/tienda/Pedidos_Controller')


const route = require('express').Router()

/* POST */
//Crear pedidos, actualizar datos y enviar pedidos a la base de datos
route.post('/crear_pedido', Crear_Pedido)
route.post('/agregar_producto', Agregar_productos)
//VALIDAR SE ENCARGA DE VERIFICAR SI EXISTEN PRODUCTOS AGOTADOS O CON CAMBIOS DE PRECIOS
route.post('/validar',Validar_Pedido)
// ----------------------------------------------------------------------------------
route.post('/enviar_local', Enviar_Pedido_Local)
route.post('/enviar/:id',Enviar_pedido)

/* PUT */
route.put('/actualizar_producto', Actualizar_Cantidad_Observacion_Producto)
route.put('/actualizar_agotados_precios_pedido',Actualizar_Agotados_Precios_Pedido)

/* GET */
route.get('/productos/:strIdCliente',Consultar_Productos_Pedido)
route.get('/producto', Consultar_Producto_Agregado)
route.get('/cliente/:strIdCliente',Consultar_Datos_Cliente)
route.get('/cantidades/:idCliente', Consultar_CantidadProductos_Pedido)
route.get('/vendedor_telefono/:id',Obtener_Telefono_Vendedor)

/* DELETE */
route.delete('/eliminar_producto/:id', Eliminar_Producto)
route.delete('/eliminar_productos/:id', Eliminar_TodosLosProductos)




module.exports = route