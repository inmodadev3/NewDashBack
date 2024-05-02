const Productos = require('../../Models/movil/productos_model')
const { obtenerDatosDB_Hgi } = require('../Global_Querys')

const ProductosQuery = {}

ProductosQuery.Id = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fecha = new Date();
            const year = fecha.getFullYear();
            const month = fecha.getMonth() + 1;
            const queryProducto = Productos.Id(year, month, id)

            if (String(id).trim() !== "") {
                const producto = await obtenerDatosDB_Hgi(queryProducto)
                if (producto.length > 0) {
                    resolve(producto[0])
                } else {
                    reject("No se encontro ningun producto relacionado a la referencia.")
                }
            } else {
                reject("Referencia invalida.")
            }

        } catch (error) {
            reject(error)
        }
    })
}

module.exports = ProductosQuery