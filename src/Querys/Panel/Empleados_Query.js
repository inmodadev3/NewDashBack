const { obtenerDatosDb_Dash } = require('../Global_Querys')

const Crear_Empleado_Query = (nombre,id,user,passw,celular) =>{
    return new Promise(async(resolve, reject) => {
        try {
            const query = `INSERT INTO tbllogin (strNombreEmpleado,strUsuario,strClave,intIdCompania,strIdVendedor,strTelefonoVendedor)
            VALUES (?,?,?,?,?,?)`
            await obtenerDatosDb_Dash(query,[nombre,user,passw,1,id,celular])
            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

const Consultar_Empleados_Query = () =>{
    return new Promise(async(resolve, reject) => {
        try {
            const query = `Select * From tbllogin`
            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const Actualizar_Empleado_Query = (nombre,id,user,passw,celular,login) =>{
    return new Promise(async(resolve, reject) => {
        try {
            const query = `UPDATE tbllogin 
            SET strNombreEmpleado = ? , strUsuario = ? , strClave = ? , strIdVendedor = ?, strTelefonoVendedor = ?
            WHERE idLogin = ?`

            await obtenerDatosDb_Dash(query,[nombre,user,passw,id,celular,login])
            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

const Eliminar_Empleado_Query = (id) =>{
    return new Promise(async(resolve, reject) => {
        try {
            const query = `DELETE FROM tbllogin where idLogin = ?`
            await obtenerDatosDb_Dash(query,[id])
            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    Crear_Empleado_Query,
    Consultar_Empleados_Query,
    Actualizar_Empleado_Query,
    Eliminar_Empleado_Query,
    Consultar_Empleados_Query
}