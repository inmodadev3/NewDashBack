const { obtenerDatosDB_Hgi } = require('../Global_Querys')

const Post_Login_Query = async(idTercero,contraseña) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            const sql = `select Terc.StrIdTercero,Terc.StrNombre, TT.IntPrecio from TblTerceros Terc
            inner join TblTiposTercero as TT on Terc.IntTipoTercero = TT.IntIdTipoTercero
            where StrIdTercero = '${idTercero}'`

            const data = await obtenerDatosDB_Hgi(sql)
            resolve(data[0])
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    Post_Login_Query
}