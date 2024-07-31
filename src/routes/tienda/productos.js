const route = require('express').Router()
const {
    GetProductos,
    GetProductoXid,
    ContarProductosXClase,
    ContarProductosXLineas,
    GetProductosXGrupos,
    GetProductosXlinea,
    GetProductosXTipos,
    ContarProductosXGrupos,
    ContarProductos,
    ContarProductosXTipos,
    Buscar_Productos,
    Contar_Productos_Busqueda,
    BuscarProductosSimilares,
    ProductosSimilares,
    ProductoMasVendidosUltimoMes
} = require('../../controllers/tienda/Productos_Controller')

//OBTENER TODOS LOS PRODUCTOS
route.get('/', GetProductos)

//OBTENER MAS VENDIDOS
route.get('/mas-vendidos', ProductoMasVendidosUltimoMes)

//OBTENER PRODUCTOS POR METODO DE BUSCA
route.get('/buscar', Buscar_Productos)
route.get('/buscar/similares', BuscarProductosSimilares)

route.get('/contar/busqueda', Contar_Productos_Busqueda)

//OBTENER PRODUCTOS EN BASE AL ID DE LAS LINEAS
route.post('/lineas', GetProductosXlinea)
//OBTENER PRODUCTOS EN BASE AL ID DE LOS GRUPOS
route.post('/grupos', GetProductosXGrupos)
//OBTENER PRODUCTOS EN BASE AL ID DE LOS TIPOS
route.post('/tipos', GetProductosXTipos)

//CONTAR PRODUCTOS GENERALES con IntHablitarProducto en 1
route.get('/contar', ContarProductos)
//CONTAR PRODUCTOS POR CLASE
route.get('/contar/clase/:clase', ContarProductosXClase)
//CONTAR PRODUCTOS POR LINEA
route.post('/contar/linea', ContarProductosXLineas)
//CONTAR PRODUCTOS POR GRUPO
route.post('/contar/grupo', ContarProductosXGrupos)
//CONTAR PRODUCTOS POR Tipos
route.post('/contar/tipo', ContarProductosXTipos)

//OBTENER RECOMENDACIONES EN BASE A UN PRODUCTO
route.get('/similares/:id', ProductosSimilares)

//OBTENER PRODUCTO POR STRIDPRODUCTO
route.get('/:id', GetProductoXid)






module.exports = route