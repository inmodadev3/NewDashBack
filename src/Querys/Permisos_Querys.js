const { obtenerDatosDb_Dash } = require("./Global_Querys")

const Consultar_lista_permisos_Query = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `select * from PermisosWeb`
            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const crear_nuevo_permiso_Query = async (nombre_permiso) => {
    try {
        const query = `INSERT INTO PermisosWeb (nombre_permiso) VALUES (?)`
        await obtenerDatosDb_Dash(query, [nombre_permiso])
    } catch (error) {
        throw new Error(error)
    }
}

const consultar_permisos_usuario_Query = (id_usuario) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `SELECT pw.id_permiso FROM tblUsuarios_Permisos up JOIN permisosweb pw ON up.id_permiso = pw.id_permiso WHERE up.idLogin = ?`

            const data = await obtenerDatosDb_Dash(query, [id_usuario])
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const Agregar_Permiso_Query = async(id_usuario, id_permiso) => {
    try {
        const query = `INSERT INTO tblUsuarios_Permisos (idLogin,id_permiso) VALUES (?,?)`
        await obtenerDatosDb_Dash(query,[id_usuario,id_permiso])
    } catch (error) {
        throw new Error(error)
    }
}

const Eliminar_Permiso_query = async(id_usuario, id_permiso) =>{
    try {
        const query = 'delete from tblUsuarios_Permisos where idLogin = ? and id_permiso = ?'
        await obtenerDatosDb_Dash(query,[id_usuario,id_permiso])
    } catch (error) {
        throw new Error(error)
    }
}





module.exports = {
    Consultar_lista_permisos_Query,
    crear_nuevo_permiso_Query,
    consultar_permisos_usuario_Query,
    Agregar_Permiso_Query,
    Eliminar_Permiso_query
}