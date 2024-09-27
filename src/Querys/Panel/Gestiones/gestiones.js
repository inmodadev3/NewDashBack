const { obtenerDatosDb_Dash, obtenerDatosDB_Hgi } = require('../../Global_Querys')

const obtenerGestiones_Query = async (filtrar, zona, vendedor, orden) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result;

            if (filtrar.toString() == 1) {
                const query_Dash_Inicial = `
                SELECT g.strIdTercero, g.dtFechagestion AS fechaMasReciente,strNombreEmpleado
                FROM dash.tblgestiondestapemadrinatercero g
                inner join dash.tbllogin L on G.intIdLogin = L.idLogin
                JOIN (
                    SELECT strIdTercero, MAX(dtFechagestion) AS fechaMasReciente
                    FROM dash.tblgestiondestapemadrinatercero
                    GROUP BY strIdTercero
                ) AS subg ON g.strIdTercero = subg.strIdTercero 
                        AND g.dtFechagestion = subg.fechaMasReciente
                `;

                let order;
                let seller;

                switch (orden) {
                    case '*':
                        order = ''
                        break;
                    case 'new':
                        order = 'order by g.dtFechagestion desc'
                        break;
                    case 'old':
                        order = 'order by g.dtFechagestion asc'
                    default:
                        order = ''
                        break;
                }

                if (vendedor.toString() == '*') {
                    seller = ''
                } else {
                    seller = `WHERE g.intIdLogin = ${vendedor}`
                }


                const query_Dash_Final = `${query_Dash_Inicial} ${seller} ${order}`;
                const clientes = await obtenerDatosDb_Dash(query_Dash_Final);

                if (clientes.length == 0) {
                    resolve(clientes)
                }
                const idClientes = clientes.map(item => `'${item.strIdTercero}'`).join(',');

                if (zona == '0') {
                    const queryHgiNombreClientes = `select StrIdTercero,StrNombre,IntTEstado,C.StrDescripcion as Ciudad from TblTerceros T INNER JOIN TblCiudades AS C ON C.StrIdCiudad = T.StrCiudad where StrIdTercero in (${idClientes})`
                    const hgiData = await obtenerDatosDB_Hgi(queryHgiNombreClientes)

                    const hgiMap = {};

                    hgiData.forEach(user => {
                        hgiMap[user.StrIdTercero] = {
                            nombre: user.StrNombre,
                            estado: user.IntTEstado,
                            ciudad: user.Ciudad
                        };
                    });

                    const combinedData = clientes.map(record => ({
                        id: record.strIdTercero,
                        vendedor: record.strNombreEmpleado,
                        nombre: hgiMap[record.strIdTercero].nombre,
                        estado: hgiMap[record.strIdTercero].estado,
                        fecha: record.fechaMasReciente,
                        ciudad: hgiMap[record.strIdTercero].ciudad,
                    }));

                    result = combinedData
                } else {
                    const queryHgiNombreClientes = `select StrIdTercero,StrNombre,IntTEstado,C.StrDescripcion as Ciudad from TblTerceros T INNER JOIN TblCiudades AS C ON C.StrIdCiudad = T.StrCiudad where StrCiudad = '${zona}' and StrIdTercero in (${idClientes})`
                    const hgiData = await obtenerDatosDB_Hgi(queryHgiNombreClientes)

                    const hgiMap = {};

                    hgiData.forEach(user => {
                        hgiMap[user.StrIdTercero] = {
                            nombre: user.StrNombre,
                            estado: user.IntTEstado,
                            ciudad: user.Ciudad
                        };
                    });

                    const combinedData = clientes
                        .filter(record => hgiMap[record.strIdTercero])
                        .map(record => ({
                            id: record.strIdTercero,
                            nombre: hgiMap[record.strIdTercero].nombre,
                            estado: hgiMap[record.strIdTercero].estado,
                            fecha: record.fechaMasReciente,
                            ciudad: hgiMap[record.strIdTercero].ciudad,
                            vendedor: record.strNombreEmpleado,
                        }));

                    result = combinedData
                }
            } else {
                const clientes_Con_Consulta_Query = `select distinct strIdTercero from dash.tblgestiondestapemadrinatercero group by strIdtercero`
                const clientes_Con_Consulta = await obtenerDatosDb_Dash(clientes_Con_Consulta_Query)

                let clientes_sin_Consulta_query;

                if (zona == '0') {
                    clientes_sin_Consulta_query = `select StrIdTercero,StrNombre,IntTEstado,C.StrDescripcion as Ciudad from TblTerceros T
	                INNER JOIN TblCiudades AS C ON C.StrIdCiudad = T.StrCiudad
                    where IntTEstado = 1 and intTipoTercero in ('01','02','03','04','05','09',17,18,19)`
                } else {
                    clientes_sin_Consulta_query = `select StrIdTercero,StrNombre,IntTEstado,C.StrDescripcion as Ciudad from TblTerceros T
	                INNER JOIN TblCiudades AS C ON C.StrIdCiudad = T.StrCiudad
                    where IntTEstado = 1 and StrCiudad = '${zona}' and intTipoTercero in ('01','02','03','04','05','09',17,18,19)`
                }


                const clientes_sin_gestion = await obtenerDatosDB_Hgi(clientes_sin_Consulta_query)

                const dashIds = new Set(clientes_Con_Consulta.map(record => record.strIdTercero));
                const hgiIds = new Set(clientes_sin_gestion.map(record => record.StrIdTercero));

                const idsNoEnDASH = [...hgiIds].filter(id => !dashIds.has(id));

                const combinedData = clientes_sin_gestion
                    .filter(record => idsNoEnDASH.includes(record.StrIdTercero))
                    .map(record => ({
                        id: record.StrIdTercero,
                        nombre: record.StrNombre,
                        estado: record.IntTEstado,
                        fecha: null,
                        ciudad: record.Ciudad,
                        vendedor: null
                    }));

                result = combinedData
            }

            resolve(result)

        } catch (error) {
            reject(`${error}`)
        }
    })
}


module.exports = {
    obtenerGestiones_Query
}