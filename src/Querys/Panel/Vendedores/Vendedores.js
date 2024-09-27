const { obtenerDatosDb_Dash } = require('../../Global_Querys')

const ObtenerVendedores_Query = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select DISTINCT idLogin,strNombreEmpleado,strIdVendedor from dash.tblLogin AS L
            inner join dash.tblgestiondestapemadrinatercero AS G on G.intIdLogin = L.idLogin
            `
            const vendedores = await obtenerDatosDb_Dash(query)
            resolve(vendedores)
        } catch (error) {
            reject(`${error}`)
        }
    })
}

module.exports = {
    ObtenerVendedores_Query
}