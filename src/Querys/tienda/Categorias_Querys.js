const { obtenerDatosDB_Hgi } = require('../Global_Querys')

const GetClases_Query = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select StrIdClase,StrDescripcion from TblClases where StrIdClase in ('1001','101','1011','1021','1031','971','981','991','731') order by StrDescripcion`
            const data = await obtenerDatosDB_Hgi(query)

            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetLineas_Query = async (clase) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select distinct L.StrIdLinea,L.StrDescripcion from TblLineas as L inner join TblProductos as P on L.StrIdLinea = P.StrLinea where P.StrClase = '${clase}' and P.IntHabilitarProd = 1`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetGrupo_Query = async (linea) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select distinct G.strIdGrupo,G.StrDescripcion from TblGrupos as G inner join TblProductos as P on G.StrIdGrupo = P.strGrupo where P.strLinea = '${linea}' and P.IntHabilitarProd = 1`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const GetTipo_Query = async (Grupo,Linea) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select distinct T.strIdTipo, T.strDescripcion from TblTipos as T inner join tblProductos as P on T.strIdTipo = P.strTipo where P.strGrupo = '${Grupo}' and P.StrLinea = '${Linea}' and P.IntHabilitarProd = 1`
            const data = await obtenerDatosDB_Hgi(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    GetClases_Query,
    GetLineas_Query,
    GetGrupo_Query,
    GetTipo_Query
}
