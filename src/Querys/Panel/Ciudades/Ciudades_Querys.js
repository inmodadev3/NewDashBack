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

const obtenerDepartamentos_Query = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select strIdCodigo,StrDescripcion from TblDepartamento where StrIdCodigo != '00'  order by
                            CASE 
                                WHEN StrIdCodigo = '05' THEN 0
                                ELSE 1
                            END,
                            StrDescripcion
                        `
            const departamentos = await obtenerDatosDB_Hgi(query)
            resolve(departamentos)
        } catch (error) {
            reject(`${error}`)
        }
    })
}

const obtenerCiudadesXDepartamento_Query = (idDeparamento) => {
    return new Promise(async(resolve, reject) => {
        try {
            const query = `select StrIdCiudad,StrDescripcion from TblCiudades  where StrDepartamento = '${idDeparamento}' order by StrDescripcion`
            const ciudades = await obtenerDatosDB_Hgi(query);
            resolve(ciudades)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    ObtenerCiudades_Query,
    obtenerDepartamentos_Query,
    obtenerCiudadesXDepartamento_Query
}
