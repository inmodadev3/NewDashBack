const {
    ConsultarEncargados_Query,
    obtenerDatosSeguimiento_Query,
    AgregarDatosSeguimiento_Query,
    ObtenerSeguimientos_Query,
    CrearEncargado_Query,
    BuscarSeguimiento_Query
} = require("../../../Querys/Panel/Pedidos/Seguimientos_Query");

const ConsultarEncargados = async (req, res) => {
    try {
        const encargados = await ConsultarEncargados_Query();
        const alistamiento = []
        const facturacion = []
        const revision = []

        encargados.map((encargado) => {
            switch (encargado.tipo_encargado_id) {
                case 1:
                    alistamiento.push(encargado)
                    break;

                case 2:
                    facturacion.push(encargado)
                    break;

                case 3:
                    revision.push(encargado)
                    break;
                default:
                    break;
            }
        })
        res.status(200).json({ alistamiento, facturacion, revision })
    } catch (error) {
        res.status(400).json({ message: `${error}` })
    }
}

const ConsultarEncargadosDefault = async (req, res) => {
    try {
        const encargados = await ConsultarEncargados_Query();
        res.status(200).json({ encargados })
    } catch (error) {
        res.status(400).json({ message: `${error}` })
    }
}

const obtenerDatosSeguimiento = async (req, res) => {
    const { idPedido } = req.query
    try {
        const data = await obtenerDatosSeguimiento_Query(idPedido)
        res.status(200).json({ data })
    } catch (error) {
        res.status(400).json({ message: `${error}` })
    }
}

const AgregarSeguimiento = async = (req, res) => {
    const { seguimiento } = req.body
    try {
        const response = AgregarDatosSeguimiento_Query(seguimiento)
        if (response) {
            res.status(200).json({ data: response })
        }
    } catch (error) {
        res.status(400).json({ message: `${error}` })
    }
}

const ObtenerSeguimientos = async (req, res) => {
    const { fecha } = req.query

    try {
        const seguimientos = await ObtenerSeguimientos_Query(fecha)
        res.status(200).json({ seguimientos })
    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}

const CrearEncargado = async (req, res) => {
    const { nombre, rol } = req.body
    try {
        await CrearEncargado_Query(nombre, rol)
        res.status(200).json({ data: 'Creado con exito' })
    } catch (error) {
        res.status(400).json({ error: `${error}` })
    }
}

const BuscarSeguimiento = async(req,res)=>{
    const { busqueda } = req.params 

    try {
        const data = await BuscarSeguimiento_Query(busqueda)
        res.status(200).json({seguimientos:data})
    } catch (error) {
        res.status(400).json({error: `${error}`})
    }
}

module.exports = {
    ConsultarEncargados,
    obtenerDatosSeguimiento,
    AgregarSeguimiento,
    ObtenerSeguimientos,
    ConsultarEncargadosDefault,
    CrearEncargado,
    BuscarSeguimiento
}