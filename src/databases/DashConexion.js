const mysql = require('mysql2')

const poolDash = mysql.createPool({
    host: '10.10.10.128',
    user: 'root',
    password: 'Sistemas2018*',
    database: 'DASH',
    multipleStatements: true,
    connectionLimit: 30
})

module.exports = poolDash