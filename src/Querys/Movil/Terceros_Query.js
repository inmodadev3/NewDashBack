const Terceros = require('../../Models/movil/terceros_model');
const { obtenerDatosDB_Hgi } = require('../Global_Querys')

const TercerosQuery = {}

TercerosQuery.ContadosQuery = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const fecha = new Date();
            const year = fecha.getFullYear();
            const month = fecha.getMonth() + 1;
            const contados_Query = Terceros.Contados(year, month)
            const contados = await obtenerDatosDB_Hgi(contados_Query)
            resolve(contados)
        } catch (error) {
            reject(error)
        }
    })
}

TercerosQuery.TercerosXIdQuery = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (String(id).trim() !== "") {
                const fecha = new Date();
                const year = fecha.getFullYear();
                const month = fecha.getMonth() + 1;
                const query = Terceros.Id(year, month, id)
                const tercero = await obtenerDatosDB_Hgi(query)

                if (tercero.length > 0) {
                    resolve(tercero)
                } else {
                    reject("No se ha encontrado ningun tercero asociado al numero de identificación.")
                }
            } else {
                reject("id invalido")
            }
        } catch (error) {
            reject(error)
        }
    })
}


TercerosQuery.Id
module.exports = TercerosQuery