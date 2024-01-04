const { registrar_Usuario_Query, Usuarios_Registrados_Recientes_Query, Cambiar_estado_registro_Query } = require("../../Querys/Registro_Usuarios_Query")
const path = require('path')

const Registro_Usuarios_Dash = async (req, res) => {
    try {
        const data = req.body
        const file = req.file
        const query = await registrar_Usuario_Query(data, file)
        if (query == 1) {
            res.status(200).json({ success: true })
        } else {
            res.status(400).json({ success: false, data: query })
        }
    } catch (error) {
        res.status(400).json({ data: error, message: "Ha ocurrido un error al registrar el usuario" })
    }
}

const Usuarios_Registrados_Recientes = async (req, res) => {
    try {
        const data = await Usuarios_Registrados_Recientes_Query()
        res.status(200).json({ data, success: true })
    } catch (error) {
        res.status(400).json({ data: error, success: false })
    }
}

const CambiarEstadoRegistro = async (req, res) => {
    const { id } = req.params
    try {
        const data = await Cambiar_estado_registro_Query(id, 2)
        if (data == 1) {
            res.status(200).json({ success: true })
        } else {
            res.status(400).json({ data: data, success: false })
        }
    } catch (error) {
        res.status(400).json({ data: error, success: false })
    }
}

const Descargar_Ruth = async (req, res) => {
    try {
        const { nombreArchivo } = req.params;
        const rutaArchivo = path.join(__dirname + '../../../../assets/Rut/' + nombreArchivo);


        res.download(rutaArchivo, nombreArchivo, (err) => {
            if (err) {
                res.status(404).send('Archivo no encontrado');
            }
        });
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    Registro_Usuarios_Dash,
    Usuarios_Registrados_Recientes,
    CambiarEstadoRegistro,
    Descargar_Ruth
}