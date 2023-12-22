const { Crear_Empleado_Query, Consultar_Empleados_Query, Actualizar_Empleado_Query, Eliminar_Empleado_Query } = require("../../Querys/Empleados_Query")

const Crear_Empleado = async(req,res) =>{
    const {
        nombre,
        id,
        user,
        passw,
        celular
    } = req.body
    try {
        await Crear_Empleado_Query(nombre,id,user,passw,celular)
        res.status(200).json({message:"Empleado creado correctamente"})
    } catch (error) {
        res.status(400).json({message:`${error}`})
    }
}

const Obtener_Empleados = async(req,res) =>{
    try {
        const empleados = await Consultar_Empleados_Query()
        res.status(200).json({data:empleados})
    } catch (error) {
        res.status(400).json({message:`${error}`})
    }
}

const Actualizar_Empleado = async(req,res)=>{
    const { nombre, cedula, usuario, passw, celular, login } = req.body
    
    try {
        await Actualizar_Empleado_Query(nombre, cedula, usuario, passw, celular, login)
        res.status(200).json({message:"Creado con exito"})
    } catch (error) {
        res.status(400).json({message:"Ha ocurrido un error al actualizar el empleado"})
        console.error(error)
    }
}

const Eliminar_Empleado = async(req,res) =>{
    const { id } = req.params
    try {
        await Eliminar_Empleado_Query(id)
    } catch (error) {
        res.status(400).json({message:"Ha ocurrido un error al eliminar el empleado"})
    }
}

module.exports = {
    Crear_Empleado,
    Obtener_Empleados,
    Actualizar_Empleado,
    Eliminar_Empleado,
}