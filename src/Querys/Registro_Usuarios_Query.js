const { obtenerDatosDb_Dash } = require('./Global_Querys')

const registrar_Usuario_Query = (data_doc,file) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            let {
                nombre,
                identificacion,
                tipoDoc,
                correo,
                celular,
                telefono,
                direccion,
                ciudad,
                departamento,
                linea,
                redes
            } = data_doc
            const fecha = new Date()
            const fechaFormated = fecha.toISOString()

            const  query = `INSERT INTO tblregistroclientesweb (strTipoDocCliente,strIdCliente,strNombCliente,strDeptoCliente,strCiudadCliente,strCorreoCliente,strTelefonoCliente,strCelularCliente,strLineasCliente,strRutaDocumento,dtFechaRegistro,intEstado,strDireccion,strRedes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

            await obtenerDatosDb_Dash(query,[tipoDoc,identificacion,nombre,departamento,ciudad,correo,telefono,celular,linea,file.filename,fechaFormated,1,direccion,redes?redes:""])
            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

const Usuarios_Registrados_Recientes_Query = () =>{
    return new Promise(async(resolve,reject)=>{
        try {
            const query = 'SELECT * FROM tblregistroclientesweb where intEstado = 1'
            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const Cambiar_estado_registro_Query = (id,estado) =>{
    return new Promise(async(resolve, reject) => {
        try {
            const query = `UPDATE tblregistroclientesweb SET intEstado = ? where intIdRegCliente = ?`
            const data = await obtenerDatosDb_Dash(query,[estado,id])
            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    registrar_Usuario_Query,
    Usuarios_Registrados_Recientes_Query,
    Cambiar_estado_registro_Query
}