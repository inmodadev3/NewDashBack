const HGI = require('../databases/HgiConexion').HgiConexion

const GET_GENEROS= () =>{
    return new Promise((resolve,reject)=>{
        const query = `select StrIdPParametro1 as id,StrDescripcion as descripcion from TblProdParametro1`

        HGI.query(query,(err,rows)=>{
            if(err){
                reject(err)
                return;
            }
            resolve(rows.recordset)
        })
    })
}

const GET_MATERIALES= () =>{
    return new Promise((resolve,reject)=>{
        const query = `select StrIdPParametro as id,StrDescripcion as descripcion from TblProdParametro2`

        HGI.query(query,(err,rows)=>{
            if(err){
                reject(err)
                return;
            }
            resolve(rows.recordset)
        })
    })
}

const GET_MARCAS = () =>{
    return new Promise((resolve,reject)=>{
        const query = `select StrIdPParametro as id,StrDescripcion as descripcion from TblProdParametro3`

        HGI.query(query,(err,rows)=>{
            if(err){
                reject(err)
                return;
            }
            resolve(rows.recordset)
        })
    })
}

const GET_UNIDADES = () =>{
    return new Promise((resolve,reject)=>{
        const query = `select StrIdUnidad from TblUnidades`

        HGI.query(query,(err,rows)=>{
            if(err){
                reject(err)
                return;
            }
            resolve(rows.recordset)
        })
    })
}


module.exports = {
    GET_GENEROS,
    GET_MATERIALES,
    GET_MARCAS,
    GET_UNIDADES
}