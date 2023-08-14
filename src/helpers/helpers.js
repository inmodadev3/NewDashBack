const HGI = require('../databases/HgiConexion').HgiConexion

const GetUbicaciones = (strIdProducto) =>{
    return new Promise((resolve,reject)=>{
        const query = `select StrParam2 from TblProductos where StrIdProducto = '${strIdProducto}'`

        HGI.query(query,(err,rows)=>{
            if(err){
                reject(err)
                return
            }
            resolve(rows.recordset)
        })
    })
}


module.exports = {GetUbicaciones}