const { Post_Login_Query } = require("../../Querys/tienda/Login_Querys")

const post_Login = async (req, res) => {
    const { idTercero, clave } = req.body
    try {
        if (idTercero == clave) {
            const data = await Post_Login_Query(idTercero, clave)
            if (data !== undefined) {
                res.status(200).json({ data: data, success: true, messagge: "Usuario ingresado correctamente" })
            } else {
                res.status(200).json({ data: [], success: true, messagge: "El usuario no se encuentra registrado" })
            }
        } else {
            res.status(403).json({ data: [], success: false, messagge: "Identificacion o contraseña incorrectos" })
        }
    } catch (error) {
        res.status(400).json({ data: error, success: false, messagge: "Ha ocurrido un error, Contactar con soporte" })
    }
}

module.exports = {
    post_Login
}