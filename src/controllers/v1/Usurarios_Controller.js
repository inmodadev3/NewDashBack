const jwt = require('jsonwebtoken')
const {obtenerDatosDb_Dash} = require('../../Querys/Global_Querys')

const validarUsuario = async (req, res) => {
    const data = req.body
    const { strUsuario, strClave } = data
    const secretKet = "sistemasinmoda123*"
    const query = `SELECT * FROM tbllogin where strUsuario = ? and strClave = ?`

    try {
        let rows = await obtenerDatosDb_Dash(query, [strUsuario, strClave])
        if (rows) {
            jwt.sign({ data }, secretKet, { expiresIn: '7d' }, (err, token) => {
                if(err){
                    res.status(498).json({message:"Ha ocurrido un error con el token"})
                    return;
                }
                res.status(200)
                res.json({
                    data: rows[0],
                    token
                })
            })
        } else {
            res.status(404)
            res.json({ ErrMessage: "Usuario no encontrado" })
        }
    } catch (error) {
        console.error(error)
    }
}

const ValidarTokenUsuario = (req, res) => {
    res.json({ data: "ok" })
}

const ValidarPermisosUsuario = async(req, res) => {
    const { id } = req.params
    const query = `SELECT idPermiso FROM dash.tblloginpermisos where idLogin = ? and intver = 1;`

    try {
        let rows = await obtenerDatosDb_Dash(query,[id])
        res.json({ success: true, data: rows })
    } catch (error) {
        res.status(404).json({error,message:"Ha ocurrido un error al obtener los permisos de Usuario"});
    }
}


module.exports = {
    validarUsuario,
    ValidarTokenUsuario,
    ValidarPermisosUsuario
}