const mysql = require('mysql2')

const dashConexion = mysql.createConnection({
    host: '10.10.10.128',
    user: 'root',
    password: 'Sistemas2018*',
    database: 'DASH',
    multipleStatements: true
})

const validarCnxDASH = () => {
    dashConexion.connect((err) => {
        if (err) {
            console.log('HA OCURRIDO UN ERROR AL CONECTARSE A LA BASE DE DATOS DEL DASH' + err)
            return;
        }

        console.log('CONEXION EXITOSA A LA BASE DE DATOS DASH')
    })
}


module.exports = {validarCnxDASH,dashConexion}