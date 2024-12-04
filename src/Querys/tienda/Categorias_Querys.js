const { obtenerDatosDB_Hgi } = require('../Global_Querys')

const GetClases_Query = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            //761,771,781,02,971,791,801,811,821,831,16,991,1001,1021,57,841
            const query = `select StrIdClase,StrDescripcion from TblClases where StrIdClase in ('761','771','781','02','971','791','801','811','821','831','16','991','1001','1021','57','841','851','871') ORDER BY 
            CASE StrIdClase
                WHEN '761' THEN 1
                WHEN '971' THEN 2
                WHEN '57' THEN 3
                WHEN '821' THEN 4
                WHEN '02' THEN 5
                WHEN '801' THEN 6
                WHEN '16' THEN 7
                WHEN '771' THEN 8
                WHEN '1001' THEN 9
                WHEN '811' THEN 10
                WHEN '831' THEN 11
                WHEN '781' THEN 12
                WHEN '991' THEN 13
                WHEN '791' THEN 14
                WHEN '1021' THEN 15
                WHEN '851' THEN 16
                WHEN '841' THEN 17
                ELSE 18
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

//OBTENER TODA LA LISTA DE CATEGORIAS
const GetCategorias_Query = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const clases = await GetClases_Query();
            const categorias = [];

            for (const clase of clases) {
                const lineas = await GetLineas_Query(clase.StrIdClase);
                const lineasArr = [];

                for (const linea of lineas) {
                    // Validación de línea
                    if (linea.StrIdLinea !== '0') {
                        const grupos = await GetGrupo_Query(linea.StrIdLinea);
                        const gruposArr = [];

                        for (const grupo of grupos) {
                            // Validación de grupo
                            if (grupo.strIdGrupo !== '0') {
                                const tipos = await GetTipo_Query(grupo.strIdGrupo, linea.StrIdLinea);

                                // Validación de tipos
                                const grupoInfo = {
                                    grupo: grupo,
                                    tipos: tipos.length > 0 && tipos[0].strIdTipo !== '0' ? tipos : [],
                                };
                                gruposArr.push(grupoInfo);
                            }
                        }

                        const lineaInfo = {
                            linea: linea,
                            grupos: gruposArr,
                        };
                        lineasArr.push(lineaInfo);
                    }
                }

                categorias.push({
                    clase: clase,
                    lineas: lineasArr,
                });
            }

            resolve(categorias);
        } catch (error) {
            reject(`${error}`)
        }
    })
}

module.exports = {
    GetClases_Query,
    GetLineas_Query,
    GetGrupo_Query,
    GetTipo_Query,
    GetCategorias_Query
}
