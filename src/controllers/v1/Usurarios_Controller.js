const jwt = require('jsonwebtoken')
const DASH = require('../../databases/DashConexion').dashConexion

const validarUsuario = (req, res) => {
    const data = req.body
    const { strUsuario, strClave } = data
    const secretKet = "sistemasinmoda123*"
    const query = `SELECT * FROM tbllogin where strUsuario = ? and strClave = ?`
    DASH.query(query, [strUsuario, strClave], (err, rows) => {
        if (err) {
            console.log(err)
        }

        if (rows && rows.length !== 0) {
            jwt.sign({ data }, secretKet, { expiresIn: '7d' }, (err, token) => {
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
    })
}

const ValidarTokenUsuario = (req, res) => {
    res.json({ data: "ok" })
}

const ValidarPermisosUsuario = (req, res) => {
    const { id } = req.params
    const query = `SELECT idPermiso FROM dash.tblloginpermisos where idLogin = ? and intver = 1;;`
    DASH.query(query, [id], (err, rows) => {
        if (err) {
            res.status(404);
            return
        }

        res.json({ success: true, data: rows })
    })

}


module.exports = {
    validarUsuario,
    ValidarTokenUsuario,
    ValidarPermisosUsuario
}