const calcularDigitoVerificacion = require('../../utils/codigoVerificacionDian')
const { obtenerDatosDb_Dash, obtenerDatosDB_Hgi } = require('../Global_Querys')
const axios = require('axios')

const registrar_Usuario_Query = (data_doc, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            let {
                strIdTercero,
                strNombre,
                StrApellidos,
                strTipoId,
                strDireccion,
                strCelular,
                StrCiudad,
                StrMail,
                ciudad
            } = data_doc

            //VALIDAR EXISTENCIA EN HGI.
            const query = `select TOP 1 * from tblterceros where StrIdTercero = '${strIdTercero}'`
            const existente = await obtenerDatosDB_Hgi(query)

            if (existente.length > 0) {
                reject("El cliente ya se encuentra registrado")
            } else {
                const clienteHgi = crear_cliente_hgi(data_doc)

                if (clienteHgi) {
                    const query = `INSERT INTO tblRegistroMayoristasHgi (strTipoIdCliente,strIdCliente,strNombreCliente,strCorreoCliente,strCiudadCliente,strCelularCliente,strDireccion,strRutaRut,intEstadoRegistro) VALUES (?,?,?,?,?,?,?,?,?)`

                    await obtenerDatosDb_Dash(query, [strTipoId, strIdTercero, `${strNombre} ${StrApellidos}`, StrMail, ciudad, strCelular, strDireccion, file.filename, 1])
                    resolve(true)
                } else {
                    reject(`${clienteHgi}`)
                }
            }

            resolve(1)
        } catch (error) {
            reject(error)
        }
    })
}

const Usuarios_Registrados_Recientes_Query = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = 'SELECT * FROM tblRegistroMayoristasHgi where intEstadoRegistro = 1 order by intId desc '
            const data = await obtenerDatosDb_Dash(query)
            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

const Cambiar_estado_registro_Query = (id, estado, strIdTercero) => {
    return new Promise(async (resolve, reject) => {
        try {

            const queryDash = `UPDATE tblRegistroMayoristasHgi SET intEstadoRegistro = ? where intId = ?`
            if (estado == 2) {
                const queryHgi = `
                DISABLE TRIGGER TgHgiNet_TblTerceros on TblTerceros;
                update TblTerceros set IntTEstado = 1 where StrIdTercero = '${strIdTercero}'
                `
                obtenerDatosDB_Hgi(queryHgi).then(async () => {
                    await obtenerDatosDb_Dash(queryDash, [estado, id])
                    resolve(true)
                }).catch((error) => {
                    reject(error)
                })
            } else if (estado == 3) {
                await obtenerDatosDb_Dash(queryDash, [estado, id])
                resolve(true)
            }

        } catch (error) {
            reject(error)
        }
    })
}

const crear_cliente_hgi = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let {
                strIdTercero,
                strNombre,
                StrApellidos,
                strTipoId,
                strDireccion,
                strCelular,
                StrCiudad,
                StrMail,
                ciudad
            } = data

            const tokenHgiRequest = await axios.get('http://10.10.10.150/HGInetServiciosWeb/Api/Autenticar?usuario=ANDRES_OROZCO&clave=AO1141*&cod_compania=1&cod_empresa=1')
            const tokenHgiResponse = tokenHgiRequest.data.JwtToken;

            // Configuración del encabezado
            const headers = {
                Authorization: `Bearer ${tokenHgiResponse}`,
                "Content-Type": "application/json",
            };

            //DATOS PARA CREAR
            const separarApellidos = String(StrApellidos).split(" ")
            const crearTerceroDatos = [
                {
                    "NumeroIdentificacion": String(strIdTercero),
                    "Nombre": `${strNombre} ${StrApellidos}`,
                    "TipoIdentificacion": String(strTipoId),
                    "CodigoTipoPersona": 1,
                    "CodigoRegimenTributario": 1,
                    "Responsabilidad05": 1,
                    "Responsabilidad07": 0,
                    "Responsabilidad09": 0,
                    "Responsabilidad35": 1,
                    "Descuento": 0,
                    "DescuentoAuxiliar": 0,
                    "Puntos": 0,
                    "DatoTexto0": 0,
                    "DatoTexto1": 0,
                    "DatoTexto2": 0,
                    "CategoriaPuntos": "0",
                    "Cupo": 0,
                    "CodigoSucursal": "0",
                    "CodigoCausaRetiro": "0",
                    "CodigoTipoTercero": "01",
                    "Estado": 0,
                    "Nombre1": strNombre,
                    "Apellido1": separarApellidos[0] ?? "",
                    "Apellido2": separarApellidos[1] ?? "",
                    "Direccion": strDireccion,
                    "Celular": String(strCelular).trim(),
                    "CodigoCiudad": String(StrCiudad),
                    "Email": String(StrMail),
                    "EmailFacturaElectronica": String(StrMail),
                    "DigitoVerificacion": calcularDigitoVerificacion(String(strIdTercero)),
                    "Observaciones": "Registrado desde la tienda"
                }
            ]

            const responseHGI = await axios.post("http://10.10.10.150/HGInetServiciosWeb/Api/Terceros/Crear", crearTerceroDatos, { headers });
            const dataHgi = responseHGI.data


            if (responseHGI) {
                resolve(true)
            } else {
                console.error("Error al crear el cliente en hgi ", dataHgi)
                reject("Ha ocurrido un error al crear el cliente")
            }
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