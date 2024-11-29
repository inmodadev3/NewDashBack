const { registrar_Usuario_Query, Usuarios_Registrados_Recientes_Query, Cambiar_estado_registro_Query } = require("../../Querys/Panel/Registro_Usuarios_Query")
const path = require('path')

const Registro_Usuarios_Dash = async (req, res) => {
    try {
        const data = req.body
        const file = req.file

        let {
            strIdTercero,
            strNombre,
            StrApellidos,
            strTipoId,
            strDireccion,
            strCelular,
            StrCiudad,
            StrMail,
        } = data

        if (!strIdTercero || String(strIdTercero).trim() == "") {
            res.status(400).json({ error: "Datos inválidos", message: "El campo 'Identificacion' es obligatorio." })
        }

        if (!strNombre || String(strNombre).trim() == "") {
            res.status(400).json({ error: "Datos inválidos", message: "El campo 'Nombre' es obligatorio." })
        }

        if (!StrApellidos || String(StrApellidos).trim() == "") {
            res.status(400).json({ error: "Datos inválidos", message: "El campo 'Apellidos' es obligatorio." })
        }

        if (!strDireccion || String(strDireccion).trim() == "") {
            res.status(400).json({ error: "Datos inválidos", message: "El campo 'Dirección' es obligatorio." })
        }

        if (!strCelular || String(strCelular).trim() == "") {
            res.status(400).json({ error: "Datos inválidos", message: "El campo 'Celular' es obligatorio." })
        }

        if (!StrCiudad || String(StrCiudad).trim() == "") {
            res.status(400).json({ error: "Datos inválidos", message: "El campo 'Ciudad' es obligatorio." })
        }

        if (!file) {
            res.status(400).json({ error: "Datos inválidos", message: "El Archivo no es valido" })
        }


        const query = await registrar_Usuario_Query(data, file)
        if (query) {
            res.status(200).json({ success: true })
        } else {
            res.status(400).json({ success: false, data: query })
        }
    } catch (error) {
        res.status(400).json({ data: `${error}`, message: "Ha ocurrido un error al registrar el usuario" })
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
    const { id, strIdTercero, estado } = req.params
    try {
        const data = await Cambiar_estado_registro_Query(id, Number(estado), strIdTercero)
        if (data) {
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