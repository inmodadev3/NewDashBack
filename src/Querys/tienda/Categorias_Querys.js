const { obtenerDatosDB_Hgi } = require('../Global_Querys')

const GetClases_Query = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select StrIdClase,StrDescripcion from TblClases where StrIdClase in ('741','1001','101','1021','1031','971','991','731','1011') ORDER BY 
            CASE StrIdClase
                WHEN '731' THEN 1
                WHEN '971' THEN 2
                WHEN '1031' THEN 3
                WHEN '1001' THEN 4
                WHEN '101' THEN 5
                WHEN '1021' THEN 6
                WHEN '741' THEN 7
                WHEN '991' THEN 8
                WHEN '1011' THEN 9
                ELSE 10
            END;`;
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

const GetTipo_Query = async (Grupo, Linea) => {
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
