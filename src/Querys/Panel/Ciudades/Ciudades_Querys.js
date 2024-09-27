const { obtenerDatosDB_Hgi } = require('../../Global_Querys')

const ObtenerCiudades_Query = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select StrIdCiudad,StrDescripcion from TblCiudades order by 
            CASE 
                WHEN StrDescripcion = 'General' THEN 0
                ELSE 1
            END,
            StrDescripcion

            `

            const ciudades = await obtenerDatosDB_Hgi(query)
            resolve(ciudades)
        } catch (error) {
            reject(`${error}`)
        }
    })
}

module.exports = {
    ObtenerCiudades_Query
}
