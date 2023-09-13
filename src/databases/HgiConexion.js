const mysql = require('mssql')

const config ={
    user:'Hgi',
    password:'Hgi',
    server:'192.168.1.127\\SQLEXPRESS',
    database:'INMODANET',
    options:{
        encrypt : false
    },
    pool:{
        max: 30,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const poolHgi = new mysql.ConnectionPool(config)


module.exports = {poolHgi}