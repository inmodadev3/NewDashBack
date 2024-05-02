const Vendedores = require('../../Models/movil/vendedores_model')
const { obtenerDatosDb_Dash } = require('../Global_Querys')

const VendedoresQuery = {}

VendedoresQuery.Login = (user, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (String(user).toString().trim() !== "" && user) {
                if (String(password).toString().trim() !== "" && password) {
                    const Login_Query = Vendedores.Login()
                    const Login = await obtenerDatosDb_Dash(Login_Query, [user, password])
                    if (Login.length == 0) {
                        reject("Usuario o contraseña incorrecto")
                    }
                    resolve(Login)
                } else {
                    reject('Contraseña no valida')
                }
            } else {
                reject('Usuario no valido')
            }
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = VendedoresQuery