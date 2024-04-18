const { Consultar_lista_permisos_Query, crear_nuevo_permiso_Query, consultar_permisos_usuario_Query, Eliminar_Permiso_query, Agregar_Permiso_Query } = require("../../Querys/Panel/Permisos_Querys");

const Consultar_lista_permisos = async(req,res) =>{
    try {
        const listaPermisos = await Consultar_lista_permisos_Query()
        res.status(200).json({ permisos: listaPermisos });
    } catch (error) {
        console.error('Error al consultar permisos:', error);

        res.status(400).json({ error: 'Hubo un error al procesar la solicitud.' });
    }
}

const Crear_nuevo_permiso = async(req,res) =>{
    const { nombre_permiso } = req.body
    try {
        await crear_nuevo_permiso_Query(nombre_permiso)
        res.status(200).json({message:"Creado con exito"})
    } catch (error) {
        console.error('Error al consultar permisos:', error);

        res.status(400).json({ error: 'Hubo un error al procesar la solicitud.' });
    }
}

const Consultar_permisos_usuario = async(req,res) =>{
    const { id_usuario } = req.params
    try {
        const listaPermisos = await consultar_permisos_usuario_Query(id_usuario)
        res.status(200).json({ permisos: listaPermisos });
    } catch (error) {
        console.error('Error al consultar permisos:', error);

        res.status(400).json({ error: 'Hubo un error al procesar la solicitud.' });
    }
}

const Eliminar_Permiso = async(req,res) =>{
    const { id_usuario, id_permiso } = req.params
    try {
        await Eliminar_Permiso_query(id_usuario, id_permiso)
        res.status(200).json({message:"Eliminado con exito"})
    } catch (error) {
        console.error('Error al consultar permisos:', error);

        res.status(400).json({ error: 'Hubo un error al procesar la solicitud.' });
    }
}

const Agregar_Permiso = async(req,res)=>{
    const { id_usuario, id_permiso } = req.body
    try {
        await Agregar_Permiso_Query(id_usuario, id_permiso)
        res.status(200).json({message:"Creado con exito"})
    } catch (error) {
        console.error('Error al consultar permisos:', error);

        res.status(400).json({ error: 'Hubo un error al procesar la solicitud.' });
    }
}


module.exports = {
    Consultar_lista_permisos,
    Crear_nuevo_permiso,
    Consultar_permisos_usuario,
    Eliminar_Permiso,
    Agregar_Permiso
}