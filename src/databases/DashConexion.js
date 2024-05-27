const mysql = require('mysql2')

const config = {
    host: '10.10.10.128',
    user: 'root',
    password: 'Sistemas2018*',
    database: 'DASH',
    multipleStatements: true,
    connectionLimit: 100
}

const devConfig = {
    host: 'localhost',
    user: 'root',
    password: 'sistemas2',
    database: 'dash',
    multipleStatements: true,
    connectionLimit: 100
}

const poolDash = mysql.createPool(config)


module.exports = poolDash