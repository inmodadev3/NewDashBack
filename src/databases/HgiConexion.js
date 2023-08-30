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
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const HgiConexion = new mysql.ConnectionPool(config)

const ConexionHgi = () =>{
    HgiConexion.connect(err=>{
        if(err){
            console.log('error al conectar a la base de datos HGI')
            return
        }

        console.log('CONEXION EXITOSA A LA BASE DE DATOS HGI')
    })
}

module.exports = {HgiConexion, ConexionHgi}